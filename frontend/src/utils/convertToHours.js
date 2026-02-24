export const convertTo12Hour=(time24)=> {
  const [hours, minutes] = time24.split(":");

  let hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour; // handle 00 and 12 case

  return `${hour}:${minutes} ${ampm}`;
}

export const formatDate = (dateInput) => {
  return new Date(dateInput).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};