'use client'
import { FormField } from '@/types/common';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as yup from 'yup';

interface FormikFormProps {
    formFields: FormField[]
    isLoading?: boolean
    initialValues: object
    validationSchema?: any, // yup.ObjectSchema<any>
    onSubmit: (
        values: Partial<object>,
        actions: FormikHelpers<Partial<object>>
    ) => void,
    submitLabel?: string
    showReset?: boolean
    validate?: (values: Partial<object>) => void
}

export const FormikForm = ({
    formFields,
    isLoading,
    initialValues,
    validationSchema,
    onSubmit,
    submitLabel,
    showReset = true,
}: FormikFormProps
) => {

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {() => (
                <Form className='flex flex-row flex-wrap m-4'>
                    {formFields.map(field => {
                        switch (field.type) {
                            case "input":
                            case "text":
                            case "number":
                            case "password":
                                return (
                                    <div key={field.name} className={field?.className}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        <Field id={field.name} name={field.name} type={field.componentType} />
                                        <ErrorMessage name={field.name} component="div" />
                                    </div>
                                );
                            case "textarea":
                                return (
                                    <div key={field.name} className={field?.className}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        <Field id={field.name} name={field.name} as="textarea" />
                                        <ErrorMessage name={field.name} component="div" />
                                    </div>
                                );
                            case "select":
                                if (!field.options) {
                                    console.error("Options are required for select fields");
                                    return null;
                                }
                                return (
                                    <div key={field.name} className={field?.className}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        <Field as="select" name={field.name}>
                                            {field.options.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </Field>
                                    </div>
                                );
                            case "checkbox":
                                return (
                                    <div key={field.name} className={field?.className}>
                                        <label htmlFor={field.name}>{field.label}</label>
                                        <Field type="checkbox" name={field.name} />
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                    <div className='flex w-full mt-4 gap-2 justify-end' >
                        {showReset &&
                            <button
                                className='w-1/2 sm:w-1/4 bg-transparent border-blue-400 border-2'
                                type="reset"
                            >
                                Reset
                            </button>
                        }
                        <button
                            disabled={isLoading}
                            className='w-1/2 sm:w-1/4'
                            type="submit"
                        >
                            {submitLabel || 'Submit'}
                        </button>
                    </div>
                </Form>
            )}

        </Formik>
    )
}
