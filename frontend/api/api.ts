// services/api.ts

// Use your Codespaces-provided forwarded URL here
const API_URL = process.env.NEXT_PUBLIC_API_URL;

//signup function
export async function signup(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.log(" Signup failed:", errData);
    const message = errData.detail || errData.error || "Failed to sign up";
    throw new Error(message);
  }

  return response.json();
}

//sign in function
export async function signin(email: string, password: string) {
  const response = await fetch(`${API_URL}/signin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.log(" Signin failed:", errData);
    const message = errData.detail || errData.error || "Failed to sign in";
    throw new Error(message);
  }

  return response.json();
}

//fetching users to the frontend
export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch users");
  }
  return res.json();
}

// function for recoding the usage of the user
export async function recordUsage(userId: number, pageName: string, durationseconds: number ) {
  const response = await fetch (`${API_URL}/insert_user_usage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId, page_name: pageName, duration_seconds: durationseconds }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.log("Recording usage failed:", errData);
    const message = errData.detail || errData.error || "Failed to record usage";
    throw new Error(message);
  }

  return response.json();
}


export async function fetchUserUsage(userId: number) {
  const response = await fetch(`${API_URL}/user_usage/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.log("Fetching user usage failed:", errData);
    const message = errData.detail || errData.error || "Failed to fetch user usage";
    throw new Error(message);
  }

  return response.json();
}

//adding pdf files to the storage of the user
export async function insertPdfFiles(userId: number, files: File[]) {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  formData.append("user_id", String(userId));

  const response = await fetch(`${API_URL}/insert_pdf_file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = "Failed to upload PDF";
    try {
      const errData = await response.json();
      message = errData?.detail || errData?.error || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

// function to get users saved pdfs with categories
export async function fetch_user_pdfs(user_id:number){
  const res = await fetch(`${API_URL}/get_user_pdfs/${user_id}`);
  if(!res.ok){
    const errData = await res.json().catch(()=>({}));
    throw new Error(errData.error || "Failed to fetch users pdfs")
  }
  return res.json();
}

// Call this after user uploads a file
export async function classifyUserFiles(userId: number) {
  const res = await fetch(`${API_URL}/classify_user_files/${userId}`, {
    method: "POST"
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || "Failed to classify user files");
  }

  return res.json();
}

// creating a function for text to pdf, classification, upload
export async function txt_file_convert(userId:number, title:string, text:string){
  const res = await fetch(`${API_URL}/txt_file_convert/${userId}`,{
    method:'POST',
    headers:{
      'Content-type':'application/json',
    },
    body:JSON.stringify({title,text }),
  });

  if(!res.ok){
    const errData = await res.json().catch(()=>({}));
    throw new Error(errData?.error || "Failed to convert and add the file to DB");
  }
  return res.json();
}

console.log("current API URL:", API_URL);

// for sending QA selection of the user
// Frontend: send QA selection with cache check
export async function send_qa_selection(
  userId: number,
  fileURL: string,
  category: string,
  num_questions: number = 20
) {
  try {
    console.log("DEBUG: Checking existing QA for:", fileURL, category);

    //  Check if QA already exists
    const checkRes = await fetch(`${API_URL}/qa/check_existing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, fileURL, category })
    });

    if (!checkRes.ok) {
      const errorText = await checkRes.text();
      throw new Error(`Failed to check existing QA: ${errorText}`);
    }

    const checkData = await checkRes.json();
    if (checkData.exists) {
      console.log("DEBUG: Returning cached QA", checkData.qa);
      return { message: "QA already exists", cachedQA: checkData.qa };
    }

    //  If not existing, generate QA
    console.log("DEBUG: Sending QA generation request to:", `${API_URL}/qa/selection`);
    const res = await fetch(`${API_URL}/qa/selection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        fileURL,
        category,
        num_questions
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to send data: ${errorText}`);
    }

    const data = await res.json();
    console.log("DEBUG: QA API response:", data);
    return data;

  } catch (err) {
    console.error("Error sending QA selection", err);
    return null;
  }
}


// For file upload (stays the same)
export async function uploadFile(userId: number, file: File) {
  const formData = new FormData();
  formData.append("user_id", String(userId));
  formData.append("file", file);

  const res = await fetch(`${API_URL}/temp_upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload temporary file");
  return res.json();
}


//function to count the generated qa, per user
export async function fetch_user_qa_count(user_id:number){
  const res = await fetch(`${API_URL}/qa/user_qa_count/${user_id}`,{
    method:'GET'
  });
  if(!res.ok){
    const errData = await res.json().catch(()=>({}));
    throw new Error(errData.error||"failed to fetch the user qa count");
  }
  return res.json();
}
