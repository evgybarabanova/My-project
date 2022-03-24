
async function getAdvice() {
  const response = await axios(
    `https://api.adviceslip.com/advice`,
    {
      headers: {
        'X-API-KEY': key,
      },
    }
  )
}
