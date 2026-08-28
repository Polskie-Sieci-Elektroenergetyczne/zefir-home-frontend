"use client";

import { FormikProvider, useFormik } from "formik";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { z } from "zod";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { ToggleGroupItem } from "@/components/ui/toggle-group";

import { CheckboxField } from "@/components/forms/fields/checkbox-field";
import { CheckboxGroupField } from "@/components/forms/fields/checkbox-group-field";
import { ColorField } from "@/components/forms/fields/color-field";
import { ComboboxField } from "@/components/forms/fields/combobox-field";
import {
  DatePickerField,
  DateRangeField,
} from "@/components/forms/fields/date-picker-field";
import { FileUploadField } from "@/components/forms/fields/file-upload-field";
import { OtpField } from "@/components/forms/fields/otp-field";
import { RadioGroupField } from "@/components/forms/fields/radio-group-field";
import { SelectField } from "@/components/forms/fields/select-field";
import { SliderField } from "@/components/forms/fields/slider-field";
import { SwitchField } from "@/components/forms/fields/switch-field";
import { TagsField } from "@/components/forms/fields/tags-field";
import { TextField } from "@/components/forms/fields/text-field";
import { TextareaField } from "@/components/forms/fields/textarea-field";
import { ToggleGroupField } from "@/components/forms/fields/toggle-group-field";

const demoFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  age: z
    .number({ error: "Age is required" })
    .min(18, "Must be at least 18 years old"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  website: z.string().url("Invalid URL").or(z.literal("")),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  country: z.string().min(1, "Please select a country"),
  framework: z.string().min(1, "Please select a framework"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  gender: z.string().min(1, "Please select gender"),
  newsletter: z.boolean(),
  rating: z.number().min(0).max(10),
  birthDate: z.date().optional(),
  dateRange: z.any().optional(),
  eventTime: z.string().optional(),
  favoriteColor: z.string().optional(),
  otp: z.string().min(6, "Please enter 6 digits"),
  formatting: z.array(z.string()).optional(),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
  avatar: z.array(z.any()).optional(),
});

type DemoFormValues = {
  name: string;
  email: string;
  age?: number;
  password: string;
  phone: string;
  website: string;
  bio: string;
  country: string;
  framework: string;
  interests: string[];
  gender: string;
  newsletter: boolean;
  rating: number;
  birthDate?: Date;
  dateRange?: DateRange;
  eventTime?: string;
  favoriteColor?: string;
  otp: string;
  formatting?: string[];
  tags: string[];
  terms: boolean;
  avatar?: File[];
};

const initialValues: DemoFormValues = {
  name: "",
  email: "",
  age: undefined,
  password: "",
  phone: "",
  website: "",
  bio: "",
  country: "",
  framework: "",
  interests: [],
  gender: "",
  newsletter: false,
  rating: 5,
  birthDate: undefined,
  dateRange: undefined,
  eventTime: "",
  favoriteColor: "#6366f1",
  otp: "",
  formatting: [],
  tags: [],
  terms: false,
  avatar: [],
};

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
];

const frameworkOptions = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "svelte", label: "SvelteKit" },
  { value: "angular", label: "Angular" },
];

const interestOptions = [
  { value: "technology", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "travel", label: "Travel" },
  { value: "cooking", label: "Cooking" },
  { value: "reading", label: "Reading" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Separator />
      <h3 className="text-muted-foreground pt-2 text-sm font-medium tracking-wide uppercase">
        {children}
      </h3>
    </div>
  );
}

/**
 * Preserves the TanStack demo's simulated asynchronous email availability
 * check without putting network/business validation into the Zod schema.
 *
 * The timeout acts as the old asyncDebounceMs={500}.
 */
function useEmailAvailabilityValidation(
  email: string,
  setFieldError: (field: string, message: string | undefined) => void,
) {
  React.useEffect(() => {
    if (!email || email.length < 3) {
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 500));

      if (cancelled) return;

      if (email === "taken@example.com") {
        setFieldError("email", "This email is already registered");
      }
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [email, setFieldError]);
}

export default function DemoForm() {
  const formik = useFormik<DemoFormValues>({
    initialValues,
    validationSchema: demoFormSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async () => {
      alert("Form submitted successfully!");
    },
  });

  useEmailAvailabilityValidation(formik.values.email, formik.setFieldError);

  return (
    <FormikProvider value={formik}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              All Form Inputs Demo
            </CardTitle>
            <p className="text-muted-foreground">
              Every possible form input — built with Formik + Zod + shadcn/ui
            </p>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-6"
              noValidate
              aria-busy={formik.isSubmitting}
              onSubmit={formik.handleSubmit}
            >
              <SectionTitle>Text Inputs</SectionTitle>

              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  name="name"
                  label="Full Name"
                  required
                  placeholder="John Doe"
                />

                <TextField
                  name="email"
                  label="Email"
                  required
                  type="email"
                  placeholder="john@example.com"
                />

                <TextField
                  name="password"
                  label="Password"
                  required
                  type="password"
                  placeholder="Min 8 characters"
                />

                <TextField
                  name="age"
                  label="Age"
                  required
                  type="number"
                  min={18}
                  max={100}
                  placeholder="18"
                />

                <TextField
                  name="phone"
                  label="Phone"
                  required
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />

                <TextField
                  name="website"
                  label="Website"
                  type="url"
                  placeholder="https://example.com"
                />
              </FieldGroup>

              <TextareaField
                name="bio"
                label="Bio"
                required
                placeholder="Tell us about yourself..."
                maxLength={500}
                rows={4}
                showCount
              />

              <SectionTitle>Select & Combobox</SectionTitle>

              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField
                  name="country"
                  label="Country"
                  required
                  options={countryOptions}
                  placeholder="Select your country"
                />

                <ComboboxField
                  name="framework"
                  label="Framework"
                  required
                  description="Searchable dropdown"
                  options={frameworkOptions}
                  placeholder="Search frameworks..."
                />
              </FieldGroup>

              <SectionTitle>Checkbox & Radio</SectionTitle>

              <CheckboxGroupField
                name="interests"
                label="Interests"
                required
                description="Select all that apply"
                options={interestOptions}
                className="grid grid-cols-2 gap-3 md:grid-cols-3"
              />

              {formik.values.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formik.values.interests.map((value) => (
                    <Badge key={value} variant="secondary">
                      {interestOptions.find((option) => option.value === value)
                        ?.label ?? value}
                    </Badge>
                  ))}
                </div>
              )}

              <RadioGroupField
                name="gender"
                label="Gender"
                required
                options={genderOptions}
              />

              <SectionTitle>Toggle & Switch</SectionTitle>

              <SwitchField
                name="newsletter"
                label="Subscribe to Newsletter"
                description="Receive updates about new features and products"
              />

              <ToggleGroupField
                name="formatting"
                label="Text Formatting"
                description="Multi-select toggle group"
              >
                <ToggleGroupItem value="bold" aria-label="Bold">
                  <Icons.bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Italic">
                  <Icons.italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Underline">
                  <Icons.underline className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroupField>

              <CheckboxField
                name="terms"
                label="I agree to the Terms and Conditions"
                required
              />

              <SectionTitle>Slider</SectionTitle>

              <SliderField
                name="rating"
                label="Overall Rating"
                description="Rate your experience (0-10)"
                min={0}
                max={10}
                step={0.5}
              />

              <SectionTitle>Date & Time</SectionTitle>

              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DatePickerField
                  name="birthDate"
                  label="Birth Date"
                  disabledDates={(date) => date > new Date()}
                />

                <TextField name="eventTime" label="Event Time" type="time" />
              </FieldGroup>

              <DateRangeField name="dateRange" label="Date Range" />

              <SectionTitle>Special Inputs</SectionTitle>

              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <OtpField
                  name="otp"
                  label="Verification Code"
                  required
                  description="6-digit OTP input"
                />

                <ColorField
                  name="favoriteColor"
                  label="Favorite Color"
                  description="Native color picker with hex"
                />
              </FieldGroup>

              <TagsField
                name="tags"
                label="Tags"
                required
                description="Press Enter or click Add to create tags"
              />

              <SectionTitle>File Upload</SectionTitle>

              <FileUploadField
                name="avatar"
                label="Profile Picture"
                description="Drag & drop or click to upload (max 5MB)"
                maxSize={5_000_000}
                maxFiles={1}
              />

              <Separator />

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
                  disabled={formik.isSubmitting}
                  className="flex-1"
                >
                  {formik.isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="xl:sticky xl:top-16 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Form Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted max-h-[calc(100vh-8rem)] overflow-auto rounded-lg p-4 text-xs">
                {JSON.stringify(formik.values, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </FormikProvider>
  );
}
