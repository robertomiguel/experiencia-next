import * as yup from 'yup';

export const validationSchema = yup.object({
    prompt: yup.string().required().min(3).max(2000),
    negative_prompt: yup.string().trim().min(3).max(2000),
    model: yup.string().required(),
    steps: yup.number().required().min(1).max(100),
    cfg_scale: yup.number().required().min(1).max(40),
    seed: yup.number().required().min(-1).max(9999999999999),
    aspect_ratio: yup.string().required(),
    width: yup.number().required().min(205).max(1024),
    height: yup.number().required().min(205).max(1024),
    sampler: yup.string().required(),
})
