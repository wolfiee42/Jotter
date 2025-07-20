import { TErrorSource, TGenericErrorResponse } from '../interface/error'

const handleDuplicateError = (err: Error): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const matchRegex = err.message.match(/"([^"]*)"/)

  // The extracted value will be in the first capturing group
  const extractedMessage = matchRegex && matchRegex[1]

  const errorSource: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ]

  const statusCode = 400

  return {
    statusCode,
    message: 'ERROR: Duplicate Found',
    errorSource,
  }
}

export default handleDuplicateError
