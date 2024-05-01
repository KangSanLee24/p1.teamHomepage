// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  orderBy,
  query,
  deleteDoc,
  getDoc,
  updateDoc // updateDoc도 추가함
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyD9wb7FVWS4lk-xe6jVjbLeIWZRNGoZY",
  authDomain: "p1teamhomepage.firebaseapp.com",
  projectId: "p1teamhomepage",
  storageBucket: "p1teamhomepage.appspot.com",
  messagingSenderId: "1064610336155",
  appId: "1:1064610336155:web:ef624e019c8ce49bae653e",
  measurementId: "G-5V9LYC2QW3"
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*키면 당연히 되야되는 것들*/
$(document).ready(function () {
  /*수정버튼 팝업 열기*/
  $("#edit_btn").click(function (event) {
    event.preventDefault();
    var targetID = $(this).attr("href");
    $(targetID).fadeIn();
  });

  /*팝업 취소 버튼 팝업 닫기*/
  $(".cancel_btn").click(function () {
    $("#wr_popup").fadeOut();
  });
});
/*삭제버튼 누를시 삭제*/
$(".delete_btn").click(async function () {
  if (confirm("삭제하시겠습니까?")) {
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get("id"); // URL에서 ID값 가져옴
    try {
      await deleteDoc(doc(db, "members", memberId));
      alert("삭제되었습니다.");
      window.location.href = "home.html";
    } catch (error) {
      console.error("문서 삭제 중 오류 발생:", error);
      alert("문서 삭제에 실패했습니다.");
    }
  } else {
    alert("삭제가 취소되었습니다.");
  }
});
/*수정 팝업에 수정하기 버튼 누르면 update됨 */
$("#savebtn").click(async function () {
  let image = $("#image").val();
  let surname = $("#surname").val();
  let firstname = $("#firstname").val();
  let mbti = $("#mbti").val();
  let comment = $("#comment").val();
  let email = $("#email").val();
  let blog = $("#blog").val();
  let timestamp = new Date(); // 변수 timestamp에 지금 시간을 저장

  const docId = surname + firstname; /*document이름을 성+이름*/

  if (image.length === 0) {
    alert("이미지URL을 입력해주세요.");
  } else if (mbti.length === 0) {
    alert("MBTI를 선택해주세요.");
  } else if (comment.length === 0) {
    alert("각오를 입력해주세요.");
  } else if (email.length === 0) {
    alert("이메일을 입력해주세요.");
  } else if (blog.length === 0) {
    alert("블로그주소를 입력해주세요.");
  } else {
    const docRef = doc(db, "members", docId); /*document 중복된 이름 없으면 생성*/
    let docData = {
      image: image,
      surname: surname,
      firstname: firstname,
      mbti: mbti,
      comment: comment,
      blog: blog,
      email: email,
      timestamp: timestamp
    };
    console.log(docData);
    await updateDoc(docRef, docData); /*콜렉션 members에 update*/
    alert("수정한 내용이 저장되었습니다.");
    window.location.reload(); /*새로고침*/
  }
});

/*Document 이름 받으면 빈칸에 데이터를 채워줌*/
async function fetchMemberDetails(memberId) {
  /* 'members' 컬렉션에서 memberId에 해당하는 문서를 참조합니다.*/
  const docRoute = doc(db, "members", memberId); /*ref or route? 참조 가져옴*/
  const docFields = await getDoc(
    docRoute
  ); /* 변수 docFields에 docRoute 참조를 따라갔을 때 나오는 Document의 정보를 넣음.*/

  /*문서가 존재하냐*/
  if (docFields.exists()) {
    const memberData = docFields.data(); /*변수 memberData에 Document의 정보들을 넣어줌*/
    /* 변수 memberDate에 docFields다 들어왔는지 체크 한번*/
    console.log(memberData);

    /* 각 필드 값을 변수로 저장*/
    const image = memberData.image;
    const surname = memberData.surname;
    const firstname = memberData.firstname;
    const mbti = memberData.mbti;
    const email = memberData.email;
    const blog = memberData.blog;
    const comment = memberData.comment;
    /*console띄워서 변수에 정보 잘 들어갔나 체크 한번 */
    console.log(`Image URL: ${image}`);
    console.log(`Surname: ${surname}`);
    console.log(`Firstname: ${firstname}`);
    console.log(`MBTI: ${mbti}`);
    console.log(`Email: ${email}`);
    console.log(`Blog URL: ${blog}`);
    console.log(`Comment: ${comment}`);
    /*intromyself의 처음 나오는 팀원 카드 내용*/
    $("#memberimage").attr("src", image);
    $("#memberfullname").text(surname + firstname);
    $("#membermbti").text(mbti);
    $("#memberemail").text(email);
    $("#memberblog").text(blog);
    $("#membercomment").text(comment);
    /*수정하기 버튼 누르면 나오는 팝업에 내용 채워두기 성하고 이름은 수정 불가 */
    document.getElementById("image").value = image;
    document.getElementById("surname").value = surname;
    document.getElementById("firstname").value = firstname;
    document.getElementById("mbti").value = mbti;
    document.getElementById("email").value = email;
    document.getElementById("blog").value = blog;
    document.getElementById("comment").value = comment;
  } else {
    /*존재안할때 console에 남김*/
    console.log("No such member found");
    //로그를 남기는게 아니라 alert(페이지를 찾을 수 없다) 뭐 이런거 나오면서 HOME으로 돌아가는 기능?
  }
}

// 페이지 로드 시 실행
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search); // ???? window location search?
  const memberId = urlParams.get("id"); // URL에서 ID값 가져옴
  fetchMemberDetails(memberId); // 멤버정보 가져오는 함수 실행
};
