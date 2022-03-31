import Joi from "joi";

export default function Verify(schema: Joi.Schema) {
  return async function (req: any, res: any, next: any) {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
      return;
    }
    next();
  };
}

export function VerifySchema(
  schema: Joi.Schema,
  data: Record<any, any>
): boolean | Record<any, any> {
  const { error } = schema.validate(data);

  if (error) {
    return error;
  }

  return true;
}
