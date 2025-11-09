const yup = require('yup');

const signUpSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  status: yup.boolean().required(),
  phoneNo: yup.string().required(),
  username: yup.string().required(),
  role: yup.string().oneOf(['admin', 'member']).required(),
  appPermissions: yup.array().of(yup.string().oneOf(['marriage', 'library'])).default([])
}).noUnknown(true, 'Extra fields are not allowed');

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  rememberMe: yup.boolean().required(),
}).noUnknown(true, 'Extra fields are not allowed');

module.exports = { signUpSchema, loginSchema };