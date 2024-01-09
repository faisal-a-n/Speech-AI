export function buildDialogGPTRequest(
  generated_responses,
  past_user_inputs,
  content
) {
  return {
    inputs: {
      generated_responses: generated_responses,
      past_user_inputs: past_user_inputs,
      text: `Complete this, "${content}"`,
    },
  };
}
