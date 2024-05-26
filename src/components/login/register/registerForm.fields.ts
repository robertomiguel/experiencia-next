import { FormField } from "@/types/common";

export const formFields: FormField[] = [
    {
        name: "firstName",
        label: "First Name",
        type: "input",
        className: 'w-full sm:w-1/2 p-2',
    },
    {
        name: "lastName",
        label: "Last Name",
        type: "input",
        className: 'w-full sm:w-1/2 p-2',
    },
    {
        name: "email",
        label: "Email",
        type: "input",
        className: 'w-full sm:w-1/2 p-2',
    },
    {
        name: "phoneNumber",
        label: "Phone Number",
        type: "input",
        className: 'w-full sm:w-1/2 p-2',
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        className: 'w-full sm:w-1/2 p-2',
    },
    {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        className: 'w-full sm:w-1/2 p-2',
    },
];
