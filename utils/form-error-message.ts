function formErrorMesage(error: unknown, message?: string) {
  console.log(error);

  return {
    data: null,
    error:
      error instanceof Error
        ? error.message
        : (message ?? "An unknown error occurred."),
  };
}

export default formErrorMesage;
