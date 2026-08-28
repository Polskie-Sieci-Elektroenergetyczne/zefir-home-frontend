"use client";

import { FieldArray, FormikProvider, getIn, useFormik } from "formik";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SelectField } from "@/components/forms/fields/select-field";
import { TextField } from "@/components/forms/fields/text-field";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AdvancedFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  team: {
    name: string;
    size: number;
  };
  members: Array<{
    name: string;
    role: string;
  }>;
  country: string;
  state: string;
};

// ---------------------------------------------------------------------------
// Country / State data
// ---------------------------------------------------------------------------

const countryStateMap: Record<string, { value: string; label: string }[]> = {
  us: [
    { value: "ca", label: "California" },
    { value: "ny", label: "New York" },
    { value: "tx", label: "Texas" },
  ],
  uk: [
    { value: "ldn", label: "London" },
    { value: "mnc", label: "Manchester" },
    { value: "brm", label: "Birmingham" },
  ],
  au: [
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
  ],
};

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
];

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const advancedSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  team: z.object({
    name: z.string().min(2, "Team name must be at least 2 characters"),
    size: z.number().min(1, "At least 1 member").max(100, "Max 100 members"),
  }),
  members: z
    .array(
      z.object({
        name: z.string().min(1, "Member name is required"),
        role: z.string().min(1, "Role is required"),
      }),
    )
    .min(1, "Add at least one member"),
  country: z.string().min(1, "Select a country"),
  state: z.string().min(1, "Select a state"),
});

const initialValues: AdvancedFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  team: {
    name: "",
    size: 1,
  },
  members: [{ name: "", role: "" }],
  country: "",
  state: "",
};

// ---------------------------------------------------------------------------
// Async username validation
// ---------------------------------------------------------------------------

function useUsernameAvailability(
  username: string,
  setFieldError: (field: string, message: string | undefined) => void,
) {
  const [isChecking, setIsChecking] = React.useState(false);

  React.useEffect(() => {
    if (!username || username.length < 3) {
      setIsChecking(false);
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setIsChecking(true);

      await new Promise((resolve) => window.setTimeout(resolve, 500));

      if (cancelled) return;

      if (username === "admin" || username === "test") {
        setFieldError("username", "Username is taken");
      }

      setIsChecking(false);
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [username, setFieldError]);

  return isChecking;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdvancedFormPatterns() {
  const formik = useFormik<AdvancedFormValues>({
    initialValues,
    validationSchema: advancedSchema,
    onSubmit: () => {
      toast.success("Team registered successfully!");
    },
  });

  const selectedCountry = formik.values.country;
  const stateOptions = countryStateMap[selectedCountry] ?? [];

  const isCheckingUsername = useUsernameAvailability(
    formik.values.username,
    formik.setFieldError,
  );

  // TanStack's field listener reset the state whenever country changed.
  // Formik does not have field listeners, so keep that side effect explicit.
  const previousCountryRef = React.useRef(formik.values.country);

  React.useEffect(() => {
    if (previousCountryRef.current === formik.values.country) {
      return;
    }

    previousCountryRef.current = formik.values.country;

    void formik.setFieldValue("state", "", false);
    void formik.setFieldTouched("state", false, false);
  }, [formik.values.country, formik.setFieldTouched, formik.setFieldValue]);

  return (
    <FormikProvider value={formik}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Team Registration
          </CardTitle>
          <p className="text-muted-foreground">
            Demonstrates async validation, linked fields, nested objects,
            dynamic arrays, and listener side effects.
          </p>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-6"
            noValidate
            aria-busy={formik.isSubmitting}
            onSubmit={formik.handleSubmit}
          >
            {/* ─── Section 1: Account ─── */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Account</h3>
              <p className="text-muted-foreground text-sm">
                Async validation, linked fields
              </p>
            </div>

            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                name="username"
                label="Username"
                required
                placeholder="Choose a username"
                isValidating={isCheckingUsername}
              />

              <TextField
                name="email"
                label="Email"
                required
                type="email"
                placeholder="you@example.com"
              />

              <TextField
                name="password"
                label="Password"
                required
                type="password"
                placeholder="Min 8 characters"
              />

              <TextField
                name="confirmPassword"
                label="Confirm Password"
                required
                type="password"
                placeholder="Confirm password"
              />
            </FieldGroup>

            <Separator />

            {/* ─── Section 2: Team Info (nested objects) ─── */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Team Info</h3>
              <p className="text-muted-foreground text-sm">
                Nested objects with dot-notation paths
              </p>
            </div>

            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                name="team.name"
                label="Team Name"
                required
                placeholder="e.g. Alpha Squad"
              />

              <TextField
                name="team.size"
                label="Team Size"
                required
                type="number"
                min={1}
                max={100}
                placeholder="1-100"
              />
            </FieldGroup>

            <Separator />

            {/* ─── Section 3: Members (dynamic array rows) ─── */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Members</h3>
              <p className="text-muted-foreground text-sm">
                Dynamic array rows with add / remove
              </p>
            </div>

            <FieldArray name="members">
              {({ push, remove }) => (
                <div className="space-y-3">
                  {formik.values.members.map((member, index) => {
                    const namePath = `members[${index}].name`;
                    const rolePath = `members[${index}].role`;

                    const nameTouched = Boolean(
                      getIn(formik.touched, namePath),
                    );
                    const roleTouched = Boolean(
                      getIn(formik.touched, rolePath),
                    );

                    const nameError = getIn(formik.errors, namePath) as
                      | string
                      | undefined;
                    const roleError = getIn(formik.errors, rolePath) as
                      | string
                      | undefined;

                    const isNameInvalid = nameTouched && Boolean(nameError);
                    const isRoleInvalid = roleTouched && Boolean(roleError);

                    return (
                      <div key={index} className="flex items-start gap-2">
                        <Field
                          className="flex-1"
                          data-invalid={isNameInvalid || undefined}
                        >
                          <Input
                            id={`member-name-${index}`}
                            name={namePath}
                            placeholder="Member name"
                            value={member.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-label={`Member ${index + 1} name`}
                            aria-invalid={isNameInvalid || undefined}
                            aria-describedby={
                              isNameInvalid
                                ? `member-name-${index}-error`
                                : undefined
                            }
                          />

                          {isNameInvalid && (
                            <FieldError
                              id={`member-name-${index}-error`}
                              errors={[{ message: nameError }]}
                            />
                          )}
                        </Field>

                        <Field
                          className="flex-1"
                          data-invalid={isRoleInvalid || undefined}
                        >
                          <Input
                            id={`member-role-${index}`}
                            name={rolePath}
                            placeholder="Role"
                            value={member.role}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            aria-label={`Member ${index + 1} role`}
                            aria-invalid={isRoleInvalid || undefined}
                            aria-describedby={
                              isRoleInvalid
                                ? `member-role-${index}-error`
                                : undefined
                            }
                          />

                          {isRoleInvalid && (
                            <FieldError
                              id={`member-role-${index}-error`}
                              errors={[{ message: roleError }]}
                            />
                          )}
                        </Field>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          aria-label={`Remove member ${index + 1}`}
                        >
                          <Icons.close className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => push({ name: "", role: "" })}
                  >
                    <Icons.add className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>

                  {formik.values.members.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formik.values.members
                        .filter((member) => member.name)
                        .map((member, index) => (
                          <Badge
                            key={`${member.name}-${index}`}
                            variant="secondary"
                          >
                            {member.name}
                            {member.role ? ` (${member.role})` : ""}
                          </Badge>
                        ))}
                    </div>
                  )}

                  {typeof formik.errors.members === "string" &&
                    Boolean(formik.touched.members) && (
                      <FieldError
                        id="members-error"
                        errors={[{ message: formik.errors.members }]}
                      />
                    )}
                </div>
              )}
            </FieldArray>

            <Separator />

            {/* ─── Section 4: Preferences ─── */}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Preferences</h3>
              <p className="text-muted-foreground text-sm">
                Listener side effects — country resets state
              </p>
            </div>

            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                name="country"
                label="Country"
                required
                options={countryOptions}
                placeholder="Select a country"
              />

              <SelectField
                name="state"
                label="State / Region"
                required
                options={stateOptions}
                placeholder={
                  selectedCountry ? "Select state" : "Select a country first"
                }
              />
            </FieldGroup>

            <Separator />

            {/* ─── Submit ─── */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => formik.resetForm()}
                className="flex-1"
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={formik.isSubmitting || isCheckingUsername}
                className="flex-1"
              >
                Register Team
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormikProvider>
  );
}
