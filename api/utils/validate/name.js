export default (name)=>{
    const nameRegex = /^([a-zA-Zа-яА-ЯёЁ-]+( [a-zA-Zа-яА-ЯёЁ-]+)?)?$/;
    return name.length > 0 && name.length <= 50 && nameRegex.test(name);
}