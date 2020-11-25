
export const warning = (value:boolean, message: any) => {
  if (!value) {
    console.warn(message);
  }
}
