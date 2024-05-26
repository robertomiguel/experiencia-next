import { FormField } from "@/types/common";

interface Props {
    formFields: FormField[]
    submitLabel?: string
    showReset?: boolean
    submitAction: (values: any) => void
    errors: any
    isSubmitting?: boolean
}

export const HtmlForm = ({
    formFields, submitLabel, showReset, submitAction, errors, isSubmitting
}: Props) => {

    return <form action={submitAction} className='flex flex-row flex-wrap m-4'>
        {formFields.map(field => {
            switch (field.type) {
                case "input":
                case "text":
                case "number":
                case "password":
                    return (
                        <div key={field.name} className={field?.className}>
                            <label className="ml-3" htmlFor={field.name}>{field.label}</label>
                            <input id={field.name} name={field.name} type={field.componentType} />
                            <div className="ml-3" >{errors?.[field.name]}</div>
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
                className='w-1/2 sm:w-1/4'
                type="submit"
                disabled={isSubmitting}
            >
                {submitLabel || 'Submit'}
            </button>
        </div>
    </form>
}