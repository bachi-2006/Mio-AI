export interface Student {
  rollNo: string
  name: string
  email: string
}

export const students: Student[] = [
  {
    rollNo: "23P61A6743",
    name: "Rohith Dachepally",
    email: "23p61a6743@vbithyd.ac.in",
  },
  {
    rollNo: "23P61A6701",
    name: "A ABHIRAM REDDY",
    email: "23p61a6701@vbithyd.ac.in",
  },
  {
    rollNo: "23P61A6702",
    name: "ABDUL AKMAL ALLAM",
    email: "23p61a6702@vbithyd.ac.in",
  },
  // Add more students as needed
]

export function findStudent(email: string): Student | undefined {
  return students.find((student) => student.email.toLowerCase() === email.toLowerCase())
}

export function validateCredentials(email: string, password: string): Student | null {
  const student = findStudent(email)

  // Check for tester credentials
  if (email === "1" && password === "6996") {
    return {
      rollNo: "TESTER",
      name: "Tester",
      email: "tester@saturday.ai",
    }
  }

  // Validate student credentials
  if (student && student.rollNo === password) {
    return student
  }

  return null
}
