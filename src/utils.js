export const randomItem = (active, items) => {
  const length = items.length;

  while (true) {
    const index = Math.floor(Math.random() * (length - 1));
    const value = items[index];

    if(value !== active || length === 1) {
      return value;
    }
  }
};

