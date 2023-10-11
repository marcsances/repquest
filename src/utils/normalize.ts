const normalize = (input: string) => {
    return input.toLowerCase().replace(/[\s,.]/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default normalize;
