import {
  setIn,
  type FormikErrors,
  type FormikProps,
  type FormikTouched,
} from "formik";
import { useCallback, useState } from "react";
import { z } from "zod";

type HandleCancelOrBackOpts = {
  onBack?: VoidFunction;
  onCancel?: VoidFunction;
};

type StepState = {
  value: number;
  count: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
  isCompleted: boolean;
};

type AnyObjectSchema = z.ZodObject<any>;

type UseFormStepperOptions = {
  /**
   * Complete form schema. The final step re-validates this schema before
   * allowing Formik to submit.
   */
  fullSchema?: AnyObjectSchema;
};

/**
 * Converts Zod validation issues into Formik's nested error/touched shape.
 */
function getFormikValidationState<TValues>(issues: z.ZodIssue[]): {
  errors: FormikErrors<TValues>;
  touched: FormikTouched<TValues>;
} {
  let errors = {} as FormikErrors<TValues>;
  let touched = {} as FormikTouched<TValues>;

  for (const issue of issues) {
    if (issue.path.length === 0) continue;

    const path = issue.path.join(".");

    // Keep the first error for a field.
    if (!getPath(errors, path)) {
      errors = setIn(errors, path, issue.message);
    }

    touched = setIn(touched, path, true);
  }

  return { errors, touched };
}

function getPath(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, value);
}

async function validateWithSchema<TValues>(
  schema: z.ZodType,
  values: TValues,
): Promise<
  | { success: true }
  | {
      success: false;
      errors: FormikErrors<TValues>;
      touched: FormikTouched<TValues>;
    }
> {
  const result = await schema.safeParseAsync(values);

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    ...getFormikValidationState<TValues>(result.error.issues),
  };
}

/**
 * Formik + Zod multi-step form navigation.
 *
 * "Next" validates only the current step schema, so fields on later steps
 * stay pristine. The final step validates the complete schema before Formik's
 * submit handler is allowed to run.
 */
export function useFormStepper(
  schemas: AnyObjectSchema[],
  options?: UseFormStepperOptions,
) {
  const stepCount = schemas.length;
  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = useCallback(() => {
    setCurrentStep((previous) => Math.min(previous + 1, stepCount));
  }, [stepCount]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((previous) => Math.max(previous - 1, 1));
  }, []);

  const goToStep = useCallback(
    (nextStep: number) => {
      setCurrentStep(Math.min(Math.max(nextStep, 1), stepCount));
    },
    [stepCount],
  );

  const step: StepState = {
    value: currentStep,
    count: stepCount,
    goToNextStep,
    goToPrevStep,
    goToStep,
    isCompleted: currentStep === stepCount,
  };

  const currentValidator = schemas[currentStep - 1];
  const isFirstStep = currentStep === 1;

  const triggerFormGroup = async <TValues,>(form: FormikProps<TValues>) => {
    const result = await validateWithSchema(currentValidator, form.values);

    if (!result.success) {
      form.setErrors(result.errors);
      form.setTouched(result.touched, false);

      return false;
    }

    return true;
  };

  const handleNextStepOrSubmit = async <TValues,>(
    form: FormikProps<TValues>,
  ) => {
    const currentStepIsValid = await triggerFormGroup(form);

    if (!currentStepIsValid) {
      return;
    }

    if (currentStep < stepCount) {
      goToNextStep();
      return;
    }

    if (options?.fullSchema) {
      const fullResult = await validateWithSchema(
        options.fullSchema,
        form.values,
      );

      if (!fullResult.success) {
        const failingStep = await findFirstFailingStep(schemas, form.values);

        form.setErrors(fullResult.errors);
        form.setTouched(fullResult.touched, false);

        if (failingStep >= 0) {
          goToStep(failingStep + 1);
        }

        return;
      }
    }

    await form.submitForm();
  };

  const handleCancelOrBack = (opts?: HandleCancelOrBackOpts) => {
    if (currentStep > 1) {
      opts?.onBack?.();
      goToPrevStep();

      return;
    }

    opts?.onCancel?.();
  };

  return {
    step,
    currentStep,
    isFirstStep,
    currentValidator,
    triggerFormGroup,
    handleNextStepOrSubmit,
    handleCancelOrBack,
  };
}

async function findFirstFailingStep<TValues>(
  schemas: AnyObjectSchema[],
  values: TValues,
) {
  for (let index = 0; index < schemas.length; index += 1) {
    const result = await schemas[index].safeParseAsync(values);

    if (!result.success) {
      return index;
    }
  }

  return -1;
}
