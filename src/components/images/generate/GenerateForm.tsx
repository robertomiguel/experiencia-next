'use client'
import React from 'react';
import { FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateSettings } from '@/store/imagesSlice';
import { formFields } from './form.fields';
import { validationSchema } from './form.validator';
import { objectTrim } from '@/utils/objectTrim';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/common/Spinner';
import { generateImage } from './form.action';
import { FormikForm } from '@/components/common/FormikForm';
import { ImageParams } from '@/types/image';

export const GenerateForm = () => {
    const settings = useAppSelector(state => state.images.settings);
    const dispatch = useAppDispatch();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const router = useRouter();

    const handleSubmit = async (
        values: Partial<ImageParams>,
        actions: FormikHelpers<Partial<ImageParams>>
    ) => {
        dispatch(updateSettings(objectTrim(values)));
        setIsGenerating(true)
        try {
            await generateImage(objectTrim(values));
            router.push('/images')
        } catch (e) {
            setIsGenerating(false)
            actions.setSubmitting(false);
        }
    }

    return (isGenerating ? <Spinner label='Generating...' /> :
        <div>
            <FormikForm
                formFields={formFields}
                isLoading={isGenerating}
                initialValues={settings}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                submitLabel='Generate'
            />
            <button onClick={() => dispatch(updateSettings({ seed: Number(new Date()) }))}>Generate seed</button>
        </div>
    );
}