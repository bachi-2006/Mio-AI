export interface User {
  id: string
  name: string
  email: string
  isTester: boolean
}

// Student database from the provided data
const studentDatabase = [
  { id: "23P61A6701", name: "A ABHIRAM REDDY", email: "23p61a6701@vbithyd.ac.in" },
  { id: "23P61A6702", name: "ABDUL AKMAL ALLAM", email: "23p61a6702@vbithyd.ac.in" },
  { id: "23P61A6703", name: "ABHIJEET OZA", email: "23p61a6703@vbithyd.ac.in" },
  { id: "23P61A6704", name: "ADAMA KOUSHIK REDDY", email: "23p61a6704@vbithyd.ac.in" },
  { id: "23P61A6705", name: "ADELLI GANAPATHI", email: "23p61a6705@vbithyd.ac.in" },
  { id: "23P61A6706", name: "ADIDALA NIDVITHA", email: "23p61a6706@vbithyd.ac.in" },
  { id: "23P61A6707", name: "AKKINEPALLY VIJAY KUMAR", email: "23p61a6707@vbithyd.ac.in" },
  { id: "23P61A6708", name: "ALLAKA HAINDHAVI", email: "23p61a6708@vbithyd.ac.in" },
  { id: "23P61A6709", name: "ALLURI KIRAN", email: "23p61a6709@vbithyd.ac.in" },
  { id: "23P61A6710", name: "AMBATI SAIKARTHIK", email: "23p61a6710@vbithyd.ac.in" },
  { id: "23P61A6711", name: "AMGOTH MANISHA", email: "23p61a6711@vbithyd.ac.in" },
  { id: "23P61A6712", name: "AMIRISHETTI RAJESH", email: "23p61a6712@vbithyd.ac.in" },
  { id: "23P61A6713", name: "ANKITH GOUD PANUGATLA", email: "23p61a6713@vbithyd.ac.in" },
  { id: "23P61A6714", name: "ARRA MANICHANDU", email: "23p61a6714@vbithyd.ac.in" },
  { id: "23P61A6715", name: "ARUTLA SOWMYA", email: "23p61a6715@vbithyd.ac.in" },
  { id: "23P61A6716", name: "ARVAPALLI SAI GANESH", email: "23p61a6716@vbithyd.ac.in" },
  { id: "23P61A6717", name: "AVULA ANIL", email: "23p61a6717@vbithyd.ac.in" },
  { id: "23P61A6718", name: "B V PRANAV TEJ", email: "23p61a6718@vbithyd.ac.in" },
  { id: "23P61A6719", name: "BADAMI AMARNATH", email: "23p61a6719@vbithyd.ac.in" },
  { id: "23P61A6720", name: "BADDAM HARSHITH REDDY", email: "23p61a6720@vbithyd.ac.in" },
  { id: "23P61A6721", name: "BADDAM LATHIKA", email: "23p61a6721@vbithyd.ac.in" },
  { id: "23P61A6722", name: "BAMANI GANGOTHRI", email: "23p61a6722@vbithyd.ac.in" },
  { id: "23P61A6723", name: "BANJA NIPUNDHAR", email: "23p61a6723@vbithyd.ac.in" },
  { id: "23P61A6724", name: "BANOTHU NANDU", email: "23p61a6724@vbithyd.ac.in" },
  { id: "23P61A6725", name: "BASANGARI VAMSHIKRISHNA", email: "23p61a6725@vbithyd.ac.in" },
  { id: "23P61A6726", name: "BATTU BINDU", email: "23p61a6726@vbithyd.ac.in" },
  { id: "23P61A6727", name: "BATTU HEMANTH", email: "23p61a6727@vbithyd.ac.in" },
  { id: "23P61A6728", name: "BATTULA DEEPTHI PRIYA", email: "23p61a6728@vbithyd.ac.in" },
  { id: "23P61A6729", name: "BH SAI SURYA SRAVANI KRISHNA PRIYA", email: "23p61a6729@vbithyd.ac.in" },
  { id: "23P61A6730", name: "BHUKYA HARIDAS", email: "23p61a6730@vbithyd.ac.in" },
  { id: "23P61A6731", name: "BHUKYA SUNITHA", email: "23p61a6731@vbithyd.ac.in" },
  { id: "23P61A6732", name: "BODA ASMITHA SRI", email: "23p61a6732@vbithyd.ac.in" },
  { id: "23P61A6733", name: "BOGAPURAPU ANJALI", email: "23p61a6733@vbithyd.ac.in" },
  { id: "23P61A6734", name: "BOLLIKONDA PRAVALLIKA", email: "23p61a6734@vbithyd.ac.in" },
  { id: "23P61A6735", name: "BONGURAM ASHRITHA", email: "23p61a6735@vbithyd.ac.in" },
  { id: "23P61A6736", name: "BURRI ASHWINI", email: "23p61a6736@vbithyd.ac.in" },
  { id: "23P61A6737", name: "CHADALA AKSHAY", email: "23p61a6737@vbithyd.ac.in" },
  { id: "23P61A6738", name: "CHAMAKURI BRAHMANI", email: "23p61a6738@vbithyd.ac.in" },
  { id: "23P61A6739", name: "CHEDHULURI SHARAN RAJU", email: "23p61a6739@vbithyd.ac.in" },
  { id: "23P61A6740", name: "CHENNURI SRINITH", email: "23p61a6740@vbithyd.ac.in" },
  { id: "23P61A6741", name: "CHILUKURI RUDRA RAJU", email: "23p61a6741@vbithyd.ac.in" },
  { id: "23P61A6742", name: "CHIRIVELLA ABHINAYA", email: "23p61a6742@vbithyd.ac.in" },
  { id: "23P61A6743", name: "DACHEPALLY ROHITH", email: "23p61a6743@vbithyd.ac.in" },
  { id: "23P61A6744", name: "DANDEBOINA SHIRISHA", email: "23p61a6744@vbithyd.ac.in" },
  { id: "23P61A6745", name: "DANTHAMALA GOPI CHANDU", email: "23p61a6745@vbithyd.ac.in" },
  { id: "23P61A6746", name: "MISSING", email: "23p61a6746@vbithyd.ac.in" },
  { id: "23P61A6747", name: "DASARI HARSHAVARDHAN", email: "23p61a6747@vbithyd.ac.in" },
  { id: "23P61A6748", name: "DASU TEJASHWINI", email: "23p61a6748@vbithyd.ac.in" },
  { id: "23P61A6749", name: "DODLA VAMSHI KRISHNA", email: "23p61a6749@vbithyd.ac.in" },
  { id: "23P61A6750", name: "DOLI ABHINAVA SAI", email: "23p61a6750@vbithyd.ac.in" },
  { id: "23P61A6751", name: "DONTHAM VARSHITHA", email: "23p61a6751@vbithyd.ac.in" },
  { id: "23P61A6752", name: "DUGGINENI SWATHI", email: "23p61a6752@vbithyd.ac.in" },
  { id: "23P61A6753", name: "ELLIGARA AKSHAYA", email: "23p61a6753@vbithyd.ac.in" },
  { id: "23P61A6754", name: "ESLAVATH PREM KUMAR", email: "23p61a6754@vbithyd.ac.in" },
  { id: "23P61A6755", name: "GADDAM VISHNUVARDHAN", email: "23p61a6755@vbithyd.ac.in" },
  { id: "23P61A6756", name: "GADEELA VARUN KUMAR", email: "23p61a6756@vbithyd.ac.in" },
  { id: "23P61A6757", name: "GADEPALLI VAMSEE ABHINAV", email: "23p61a6757@vbithyd.ac.in" },
  { id: "23P61A6758", name: "GAJENDRULA SRAVYA", email: "23p61a6758@vbithyd.ac.in" },
  { id: "23P61A6759", name: "GAJJELA NITHISH", email: "23p61a6759@vbithyd.ac.in" },
  { id: "23P61A6760", name: "GAJULA SAHASRA", email: "23p61a6760@vbithyd.ac.in" },
  { id: "23P61A6761", name: "GANAPURAM NIKHIL", email: "23p61a6761@vbithyd.ac.in" },
  { id: "23P61A6762", name: "GOGULA RAJESH KUMAR", email: "23p61a6762@vbithyd.ac.in" },
  { id: "23P61A6763", name: "GOTTAM ASHIK", email: "23p61a6763@vbithyd.ac.in" },
  { id: "23P61A6764", name: "GURRAM AKSHITHA", email: "23p61a6764@vbithyd.ac.in" },
  // 24P6 batch
  { id: "24P65A6701", name: "ADIMULAM VINAY", email: "24p65a6701@vbithyd.ac.in" },
  { id: "24P65A6702", name: "AGRARAM KEERTHANA", email: "24p65a6702@vbithyd.ac.in" },
  { id: "24P65A6703", name: "NITHIN", email: "24p65a6703@vbithyd.ac.in" },
  { id: "24P65A6704", name: "ROHITH NAYAK", email: "24p65a6704@vbithyd.ac.in" },
  { id: "24P65A6705", name: "VAMSHI KRISHNA", email: "24p65a6705@vbithyd.ac.in" },
  { id: "24P65A6706", name: "GANJI ABHISHEK", email: "24p65a6706@vbithyd.ac.in" },
  { id: "24P65A6707", name: "GUDUGUNTLA KEERTHANA", email: "24p65a6707@vbithyd.ac.in" },
  { id: "24P65A6708", name: "JANGA KARTHIK YADAV", email: "24p65a6708@vbithyd.ac.in" },
  // Tester account
  { id: "TESTER", name: "Tester", email: "tester@tester.com" },
]

export function validateCredentials(email: string, password: string): User | null {
  // Check for tester credentials
  if (email === "1" && password === "6996") {
    return {
      id: "tester",
      name: "Tester",
      email: "tester@saturday.ai",
      isTester: true,
    }
  }

  // Extract username from email (part before @)
  const emailParts = email.split("@")
  const username = emailParts[0]

  // Convert username to uppercase for password comparison
  const expectedPassword = username.toUpperCase()

  // Find student in database
  const student = studentDatabase.find((s) => s.email.toLowerCase() === email.toLowerCase())

  if (student && (password === student.id || password === expectedPassword)) {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      isTester: false,
    }
  }

  // If email is not in the database and password is "1", register as a new user
  if (password === "1") {
    const newUser = {
      id: `NEW_${Date.now()}`,
      name: "User",
      email: email,
      isTester: false,
    }
    return newUser
  }

  return null
}
