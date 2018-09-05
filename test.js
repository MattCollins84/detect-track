class Person {

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  inTenYears() {
    return this.age + 10;
  }

}

class Adult extends Person {

  constructor(name, age, job) {
    super(name, age)
    this.job = job
  }

  yearsUntilRetirement() {
    return 65 - this.age
  }

}

const t = new Person("Tom", 27)
const m = new Person("Matt", 34)

console.log(t.name, t.age, t.inTenYears())
console.log(m.name, m.age, m.inTenYears())

const adultT = new Adult("Tom", 27, "Intern")
console.log(adultT.name, adultT.age, adultT.inTenYears(), adultT.yearsUntilRetirement())