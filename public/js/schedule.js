
let course = {name:"",code:"",total:0,lt:0,th:0,kt:0};
let lessons = [];
let programSequence = []; // đúng thứ tự: Bài -> Kiểm tra -> Bài -> ... -> Thi
let currentSessions = [];
let courseMode="";
function courseModeLabel(){return courseMode==="theory"?"Môn Lý thuyết":courseMode==="practice"?"Môn Thực hành":courseMode==="integrated"?"Môn Tích hợp":"";}
function assessmentModeFromCourse(){return courseMode==="theory"?"theory":"practice";}
function onCourseModeChange(){courseMode=document.getElementById("courseMode")?.value||"";const i=document.getElementById("courseModeInfo");if(i)i.innerHTML=courseMode==="theory"?"<b>Kiểm tra: Lý thuyết</b> — hệ thống tự xử lý.":courseMode?"<b>Kiểm tra: Thực hành</b> — hệ thống tự xử lý. Môn Tích hợp vẫn tự chọn mẫu giáo án theo từng buổi LT/TH.":"Chọn loại môn trước khi tải chương trình.";if(programSequence.length){recalcAssessments();updateCourseCards();}}

function conversionSummary(){
 const summary={lt:0,th:0,kt:0,total:0};

 if(programSequence.length){
   programSequence.forEach(x=>{
     if(x.kind==="lesson"){
       summary.lt += Number(x.ltPeriods||0);
       summary.th += Number(x.thPeriods||0);
     }else if(x.kind==="assessment"){
       summary.kt += Number(x.periodsKT||0);
       summary.th += Number(x.periodsTH||0);
     }
   });
   summary.total=summary.lt+summary.th+summary.kt;
   return summary;
 }

 summary.lt=Number(course.lt||0);
 summary.th=course.th ? Math.ceil(Number(course.th)*60/45) : 0;
 summary.total=summary.lt+summary.th;
 return summary;
}

function convertedTotal(){
 return conversionSummary().total;
}

function updateCourseCards(){
 const hasCourse=!!(course.name||course.code||course.total||course.lt||course.th||course.kt);
 document.getElementById("courseName").textContent=course.name||"Chưa tải chương trình môn học";
 document.getElementById("courseCode").textContent=course.code||"—";
 document.getElementById("totalHours").textContent=hasCourse ? (course.total||0)+" giờ" : "—";

 const s=conversionSummary();
 const convertedEl=document.getElementById("converted");
 const breakdownEl=document.getElementById("convertedBreakdown");

 if(!hasCourse){
   convertedEl.textContent="—";
   breakdownEl.innerHTML="";
   document.getElementById("formulaInfo").innerHTML=
     `<b>Quy tắc:</b> LT của từng Bài = số giờ LT; TH của từng Bài = làm tròn lên (giờ TH × 60/45). Kiểm tra tự động tính như Thực hành.`;
   return;
 }

 convertedEl.textContent=`${s.total} tiết`;
 breakdownEl.innerHTML=
   `Lý thuyết: <b>${s.lt} tiết</b><br>`+
   `Thực hành: <b>${s.th} tiết</b><br>`+
   `Kiểm tra: <b>${s.kt} tiết</b><br>`+
   `Tổng: <b>${s.total} tiết</b>`;

 document.getElementById("formulaInfo").innerHTML=
   `<b>Quy tắc đang áp dụng:</b> quy đổi <b>riêng từng Bài</b>. `+
   `LT = giờ LT; TH = CEILING(giờ TH × 60/45). `+
   `<b>Kiểm tra:</b> CEILING(giờ KT × 60/45). Sau quy đổi, <b>1 tiết đưa vào cột Kiểm tra</b>, số tiết còn lại đưa vào <b>Thực hành</b>. `+
   `<b>Thi kết thúc môn học không đưa vào Sổ đầu bài.</b>`;
}

function normalizeLines(text){
 // Chỉ tách dòng và bỏ khoảng trắng đầu/cuối.
 // KHÔNG sửa câu chữ, dấu câu, số thứ tự hay nội dung nguồn.
 return String(text||"")
   .replace(/\r\n/g,"\n")
   .replace(/\r/g,"\n")
   .split("\n")
   .map(x=>x.trim())
   .filter(x=>x.length>0);
}

function exactKey(s){
 // Chỉ dùng để so trùng; KHÔNG dùng làm nội dung hiển thị.
 return String(s||"").replace(/\s+/g," ").trim().toLowerCase();
}

function getExactCellLines(cell){
 if(!cell) return [];

 // Mammoth thường chuyển từng dòng Word thành <p>/<li>.
 // Ưu tiên đọc từng block để giữ nguyên câu chữ và dấu câu.
 const blocks=[...cell.querySelectorAll("p,li")];
 let lines=[];
 if(blocks.length){
   lines=blocks.map(el=>(el.textContent||"").trim()).filter(Boolean);
 }else{
   const raw=(cell.innerText||cell.textContent||"")
     .replace(/\r\n/g,"\n")
     .replace(/\r/g,"\n");
   lines=raw.split("\n").map(x=>x.trim()).filter(Boolean);
 }

 const out=[];
 const seen=new Set();
 for(const line of lines){
   const key=exactKey(line);
   if(key && !seen.has(key)){
     seen.add(key);
     out.push(line); // lưu nguyên văn
   }
 }
 return out;
}

function parseCourseInfo(text){
 const clean=text.replace(/\r/g," ").replace(/[ \t]+/g," ");
 let m;
 m=clean.match(/Tên môn học\s*:\s*([^\n]+)/i); if(m)course.name=m[1].trim();
 m=clean.match(/Mã(?: số)? môn học\s*:\s*([A-Za-z0-9 _-]+)/i); if(m)course.code=m[1].trim();
 m=clean.match(/Thời gian(?: thực hiện)? môn học\s*:\s*(\d+)\s*giờ/i); if(m)course.total=Number(m[1]);
 m=clean.match(/Lý thuyết\s*:\s*(\d+)\s*giờ/i); if(m)course.lt=Number(m[1]);
 m=clean.match(/Thực hành[^:]*:\s*(\d+)\s*giờ/i); if(m)course.th=Number(m[1]);
 m=clean.match(/(?:Thi\s*\/?\s*)?Kiểm tra\s*:\s*0?(\d+)\s*giờ/i); if(m)course.kt=Number(m[1]);
}

function parseDetailItems(text){
 let detail=String(text||"");

 const parts=detail.split(/2\.\s*Nội dung chi tiết\s*:/i);
 if(parts.length>1) detail=parts.slice(1).join(" ");

 detail=detail.split(/\n\s*IV\.\s*/i)[0];

 const lines=normalizeLines(detail);
 const map={};
 let currentNo=null;
 let inContent=false;

 function numbered(line){
   // Nhận 1. / 1 / 1.1. / 1.1 nhưng lưu NGUYÊN VĂN dòng gốc.
   const m=line.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
   return m ? {num:m[1], raw:line} : null;
 }

 for(const line of lines){
   const lm=line.match(/^(Bài|Chương)\s*(\d+)\s*[:\-]\s*(.*)$/i);
   if(lm){
     currentNo=Number(lm[2]);
     const titleRaw=line.replace(/\s*Thời gian\s*[:\-].*$/i,"").trim();
     if(!map[currentNo]) map[currentNo]={title:titleRaw,items:[]};
     else if(!map[currentNo].title) map[currentNo].title=titleRaw;
     inContent=false;
     continue;
   }

   if(currentNo===null) continue;

   if(/^2\.\s*Nội dung\s*:?\s*$/i.test(line) || /^Nội dung\s*:?\s*$/i.test(line)){
     inContent=true;
     continue;
   }
   if(/^1\.\s*Mục tiêu\s*:?\s*$/i.test(line) || /^Mục tiêu\s*:?\s*$/i.test(line)){
     inContent=false;
     continue;
   }

   if(inContent){
     const it=numbered(line);
     if(!it) continue;

     const body=it.raw.replace(/^(\d+(?:\.\d+)*)\.?\s+/,"");
     if(/^(Mục tiêu|Nội dung)$/i.test(body.trim())) continue;

     const depth=(it.num.match(/\./g)||[]).length;
     const key=exactKey(it.raw);
     if(!map[currentNo].items.some(x=>exactKey(x[1])===key)){
       map[currentNo].items.push([depth>=1?"sub":"major", it.raw]);
     }
   }
 }

 return map;
}

function cellNumber(td){
 const s=(td?.textContent||"").replace(/[^\d.,-]/g,"").replace(",",".").trim();
 const n=Number(s);
 return Number.isFinite(n)?n:0;
}

function parseProgramTable(htmlText, detailMap){
 const holder=document.createElement("div");
 holder.innerHTML=htmlText;
 const tables=[...holder.querySelectorAll("table")];
 let table=null;

 for(const t of tables){
   const txt=t.textContent||"";
   if(/Tên chương|Tên các bài|Tên bài/i.test(txt) && /Lý thuyết/i.test(txt) && /Thực hành/i.test(txt)){
     table=t; break;
   }
 }
 if(!table) return [];

 const rows=[...table.querySelectorAll("tr")];
 const sequence=[];
 const seenLessons=new Set();

 // Thu toàn bộ đề mục NGUYÊN VĂN từ chính bảng phân phối.
 const tableItemsByLesson={};
 let currentLessonNo=null;

 for(const row of rows){
   const cells=[...row.querySelectorAll("td,th")];
   if(cells.length<2) continue;

   const lines=getExactCellLines(cells[1]);
   if(!lines.length) continue;

   for(let li=0; li<lines.length; li++){
     const raw=lines[li];

     const lm=raw.match(/^(Bài|Chương)\s*(\d+)\s*[:\-]\s*(.+)$/i);
     if(lm){
       currentLessonNo=Number(lm[2]);
       if(!tableItemsByLesson[currentLessonNo]) tableItemsByLesson[currentLessonNo]=[];
       continue;
     }

     if(currentLessonNo!==null){
       const im=raw.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
       if(im){
         const key=exactKey(raw);
         if(!tableItemsByLesson[currentLessonNo].some(x=>exactKey(x[1])===key)){
           const depth=(im[1].match(/\./g)||[]).length;
           tableItemsByLesson[currentLessonNo].push([depth>=1?"sub":"major", raw]);
         }
       }
     }
   }
 }

 for(const row of rows){
   const cells=[...row.querySelectorAll("td,th")];
   if(cells.length<2) continue;

   const lines=getExactCellLines(cells[1]);
   const name=lines[0] || (cells[1].textContent||"").trim();

   const lm=name.match(/^(Bài|Chương)\s*(\d+)\s*[:\-]\s*(.+)$/i);
   if(lm){
     const no=Number(lm[2]);
     if(seenLessons.has(no)) continue;
     seenLessons.add(no);

     const ltHours=cellNumber(cells[3]);
     const thHours=cellNumber(cells[4]);

     // Tên bài lưu nguyên văn từ nguồn.
     const title=name.trim();

     const mergedItems=[];
     const allSources=[
       ...((detailMap[no]&&detailMap[no].items)||[]),
       ...(tableItemsByLesson[no]||[])
     ];

     for(const it of allSources){
       if(!it || !it[1]) continue;
       const key=exactKey(it[1]);
       if(!mergedItems.some(x=>exactKey(x[1])===key)){
         mergedItems.push([it[0], it[1]]); // lưu nguyên văn
       }
     }

     sequence.push({
       kind:"lesson",
       no,
       title,
       ltHours,
       thHours,
       ltPeriods:Math.ceil(ltHours),
       thPeriods:Math.ceil(thHours*60/45),
       items:mergedItems,
       itemCount:mergedItems.length
     });
     continue;
   }

   if(/^(Kiểm tra|Thi)/i.test(name)){
     if(/^Thi\s+kết\s+thúc\s+môn/i.test(name)) continue;

     const ktLt=cellNumber(cells[5]);
     const ktTh=cellNumber(cells[6]);
     const thiLt=cellNumber(cells[7]);
     const thiTh=cellNumber(cells[8]);

     const hoursLT=ktLt+thiLt;
     const hoursTH=ktTh+thiTh;
     const rawHours=(hoursLT+hoursTH) || cellNumber(cells[2]) || 1;
     const autoPeriods=Math.ceil(rawHours*60/45);

     if(autoPeriods>0){
       sequence.push({
         kind:"assessment",
         title:name.trim(), // nguyên văn
         rawHours,
         assessmentType:"Thực hành",
         periodsLT:0,
         periodsKT:1,
         periodsTH:Math.max(0,autoPeriods-1),
         periods:autoPeriods
       });
     }
   }
 }

 return sequence;
}

function recalcAssessments(){
 programSequence.forEach(x=>{
   if(x.kind!=="assessment")return;
   const mode=assessmentModeFromCourse();
   x.assessmentMode=mode;
   x.assessmentType=mode==="theory"?"Lý thuyết":"Thực hành";

   if(mode==="theory"){
     // Môn Lý thuyết: 1 giờ kiểm tra = 1 tiết Kiểm tra.
     const n=Math.max(0,Math.ceil(Number(x.rawHours||0)));
     x.periodsLT=0;
     x.periodsTH=0;
     x.periodsKT=n;
     x.periods=n;
   }else{
     // Môn Thực hành/Tích hợp: quy đổi tổng số tiết kiểm tra theo giờ thực hành.
     // Sau quy đổi, giữ đúng 01 tiết ở cột Kiểm tra; phần còn lại đưa sang cột Thực hành.
     // Ví dụ 1 giờ -> 2 tiết = 1 TH + 1 KT.
     const n=Math.max(0,Math.ceil(Number(x.rawHours||0)*60/45));
     x.periodsLT=0;
     x.periodsKT=n>0?1:0;
     x.periodsTH=Math.max(0,n-x.periodsKT);
     x.periods=n;
   }
 });
}
function renderConversionPreview(){
 const box=document.getElementById("conversionPreview");
 if(!programSequence.length){
   box.innerHTML=&#x27;<div style="color:#64748b;font-size:13px">Chưa có dữ liệu để kiểm tra.</div>&#x27;;
   return;
 }
 let rows="";
 programSequence.forEach(x=>{
   if(x.kind==="lesson"){
     rows+=`<tr>
       <td><b>${esc(x.title)}</b></td>
       <td style="text-align:center">${x.ltHours}</td>
       <td style="text-align:center">${x.thHours}</td>
       <td><b>${x.ltPeriods} LT + ${x.thPeriods} TH = ${x.ltPeriods+x.thPeriods} tiết</b></td>
     </tr>`;
   }else{
     rows+=`<tr>
       <td><b>${esc(x.title)} (Thực hành)</b></td>
       <td style="text-align:center">—</td>
       <td style="text-align:center">${x.rawHours} giờ</td>
       <td><b>${x.rawHours} giờ KT × 60/45 → ${x.periods} tiết; phân bổ: ${x.periodsKT||0} KT + ${x.periodsTH||0} TH</b></td>
     </tr>`;
   }
 });
 box.innerHTML=`<table style="width:100%;border-collapse:collapse">
 <thead><tr>
 <th style="border-bottom:1px solid #ddd;padding:7px;text-align:left">Bài / Mốc</th>
 <th style="border-bottom:1px solid #ddd;padding:7px">LT giờ</th>
 <th style="border-bottom:1px solid #ddd;padding:7px">TH giờ</th>
 <th style="border-bottom:1px solid #ddd;padding:7px;text-align:left">Sau quy đổi</th>
 </tr></thead>
 <tbody>${rows}</tbody>
 <tfoot><tr><td colspan="3" style="padding:8px;text-align:right"><b>TỔNG SAU QUY ĐỔI</b></td>
 <td style="padding:8px"><b>${conversionSummary().total} tiết</b></td></tr></tfoot>
 </table>`;
}

async function readProgramFile(file){
 if(!file)return;
 courseMode=document.getElementById("courseMode")?.value||courseMode||"";
 if(!courseMode){alert("Vui lòng chọn Loại môn học trước khi tải Chương trình môn học.");document.getElementById("programFile").value="";return;}
 const status=document.getElementById("fileStatus");
 status.textContent="Đang đọc: "+file.name+" ...";

 try{
   let text="", htmlText="";
   if(file.name.toLowerCase().endsWith(".docx")){
     if(typeof mammoth==="undefined") throw new Error("Không tải được bộ đọc DOCX. Hãy kiểm tra kết nối Internet.");
     const buf=await file.arrayBuffer();

     // Phải tạo bản sao vì ArrayBuffer có thể bị thư viện sử dụng.
     const rawResult=await mammoth.extractRawText({arrayBuffer:buf.slice(0)});
     const htmlResult=await mammoth.convertToHtml({arrayBuffer:buf.slice(0)});
     text=rawResult.value;
     htmlText=htmlResult.value;
   }else{
     text=await file.text();
   }

   // Xóa sạch dữ liệu cũ. Khi tải một môn mới, tách khỏi phiên đang mở trước đó
   // để không vô tình ghi đè dữ liệu của môn khác.
   activeWorkSessionId="";
   lessons=[];
   programSequence=[];
   course={name:"",code:"",total:0,lt:0,th:0,kt:0};
   document.getElementById("tbody").innerHTML="";

   parseCourseInfo(text);
   const detailMap=parseDetailItems(text);

   if(htmlText){
     programSequence=parseProgramTable(htmlText,detailMap);
   }

   // Fallback chỉ dành cho file text/md: đọc các Bài từ phần chi tiết,
   // không dùng dữ liệu môn trước.
   if(!programSequence.length && Object.keys(detailMap).length){
     for(const [noStr,d] of Object.entries(detailMap)){
       const no=Number(noStr);
       programSequence.push({
         kind:"lesson",no,
         title:`Bài ${no}: ${d.title||""}`,
         ltHours:0,thHours:0,ltPeriods:0,thPeriods:0,items:d.items||[]
       });
     }
   }

   lessons=programSequence.filter(x=>x.kind==="lesson");
   recalcAssessments();

   // Kiểm tra toàn bộ đề mục sau khi parse để phát hiện thiếu dữ liệu.
   const missingLessons=lessons.filter(x=>(x.items||[]).length===0);
   const totalDetectedItems=lessons.reduce((s,x)=>s+(x.items||[]).length,0);

   if(programSequence.length){
     status.innerHTML=`<b>Đã đọc:</b> ${file.name} · ${lessons.length} Bài/Chương · ${programSequence.filter(x=>x.kind==="assessment").length} mốc Kiểm tra. Thi kết thúc môn đã được loại. Dữ liệu cũ đã được xóa.`+
       (missingLessons.length
        ? `<br><span style="color:#b45309"><b>Cảnh báo:</b> ${missingLessons.length} Bài/Chương chưa nhận diện được đề mục; cần kiểm tra file gốc.</span>`
        : `<br><span style="color:#166534"><b>Đã kiểm tra:</b> tất cả Bài/Chương đều có dữ liệu đề mục nhận diện được · Tổng ${totalDetectedItems} đề mục.</span>`);
   }else{
     status.innerHTML=`<b>Chưa nhận diện được bảng phân phối thời gian.</b> Hệ thống không sử dụng dữ liệu cũ.`;
   }

   updateCourseCards();
   renderConversionPreview();
   updateWeeklyCheck();
 }catch(e){
   lessons=[];
   programSequence=[];
   status.textContent="Không đọc được file: "+e.message;
   document.getElementById("tbody").innerHTML="";
   renderConversionPreview();
 }
}

function renderWeeklySlots(){
 const n=Math.max(1,Math.min(7,Number(document.getElementById("weeklyCount").value)||1));
 const box=document.getElementById("weeklySlots");
 const old=[...box.querySelectorAll(".slot")].map(s=>({
   day:s.querySelector(".weekday")?.value,
   periods:s.querySelector(".periods")?.value
 }));
 box.innerHTML="";
 const defaultDays=[2,4,6,1,3,5,0];
 for(let i=0;i<n;i++){
   const div=document.createElement("div");div.className="slot";
   div.innerHTML=`<label>Buổi ${i+1}</label>
   <div class="slot-row">
     <select class="weekday" onchange="updateWeeklyCheck()">
       <option value="1">Thứ 2</option><option value="2">Thứ 3</option><option value="3">Thứ 4</option>
       <option value="4">Thứ 5</option><option value="5">Thứ 6</option><option value="6">Thứ 7</option><option value="0">Chủ nhật</option>
     </select>
     <input class="periods" type="number" min="1" max="10" value="${old[i]?.periods||5}" oninput="updateWeeklyCheck()">
     <span class="slot-period-label">tiết</span>
   </div>`;
   box.appendChild(div);
   div.querySelector(".weekday").value=old[i]?.day ?? defaultDays[i];
 }
 updateWeeklyCheck();
}

function updateWeeklyCheck(){
 const slots=[...document.querySelectorAll(".slot")];
 const total=slots.reduce((s,x)=>s+(Number(x.querySelector(".periods").value)||0),0);
 const target=(course.total||course.lt||course.th||course.kt) ? `<b>${convertedTotal()} tiết</b>` : `<b>tổng số tiết của môn sau khi tải file</b>`;

 const names={"0":"Chủ nhật","1":"Thứ 2","2":"Thứ 3","3":"Thứ 4","4":"Thứ 5","5":"Thứ 6","6":"Thứ 7"};
 const detail=slots.map(x=>{
   const day=x.querySelector(".weekday").value;
   const p=Number(x.querySelector(".periods").value)||0;
   return `<b>${names[day]}: ${p} tiết</b>`;
 }).join(" · ");

 document.getElementById("weeklyCheck").innerHTML=
   `<b>${slots.length} buổi/tuần</b> · <b>${total} tiết/tuần</b><br>`+
   `${detail}<br>`+
   `<span style="color:#475569">Lặp cấu hình này đến khi đủ ${target}. Ngày nghỉ chỉ bị bỏ qua, không chuyển số tiết sang ngày khác.</span>`;
}

function balancedTypes(lt,th){
 const total=lt+th, out=[]; let usedLT=0, usedTH=0;
 if(total<=0) return out;

 // Rải LT đều trong phần LT+TH, không dồn toàn bộ LT lên đầu.
 for(let i=0;i<total;i++){
   const shouldLT=Math.round((i+1)*lt/total);
   if(usedLT<lt && shouldLT>usedLT){
     out.push("LT"); usedLT++;
   }else if(usedTH<th){
     out.push("TH"); usedTH++;
   }else{
     out.push("LT"); usedLT++;
   }
 }
 return out;
}

function lessonToUnits(item){
 const types=balancedTypes(item.ltPeriods,item.thPeriods);
 const allItems=item.items||[];
 const n=types.length;
 if(!n) return [];

 // NGUYÊN TẮC BẮT BUỘC: không được bỏ sót bất kỳ đề mục nào.
 // - Nếu số đề mục >= số tiết: chia TOÀN BỘ đề mục thành các nhóm liên tiếp,
 //   giữ nguyên thứ tự và gán hết vào các tiết. Một tiết có thể chứa nhiều đề mục.
 // - Nếu số đề mục < số tiết: cho phép một đề mục kéo dài nhiều tiết;
 //   khi sang buổi khác giao diện mới ghi "(tiếp theo)".
 const perUnit=Array.from({length:n},()=>[]);

 if(allItems.length>=n){
   const counts=distributeItemCounts(allItems.length,n);
   let cursor=0;
   counts.forEach((count,ui)=>{
     for(let j=0;j<count;j++){
       const src=allItems[cursor++];
       if(Array.isArray(src)) perUnit[ui].push([src[0],src[1],false]);
       else perUnit[ui].push(["major",String(src||""),false]);
     }
   });
 }else if(allItems.length){
   for(let i=0;i<n;i++){
     const itemIndex=Math.min(allItems.length-1,Math.floor(i*allItems.length/n));
     const src=allItems[itemIndex];
     const continued=i>0 && Math.min(allItems.length-1,Math.floor((i-1)*allItems.length/n))===itemIndex;
     if(Array.isArray(src)) perUnit[i].push([src[0],src[1],continued]);
     else perUnit[i].push(["major",String(src||""),continued]);
   }
 }

 return types.map((type,i)=>({
   type,
   lesson:item.title,
   items:perUnit[i]
 }));
}

function distributeItemCounts(total,parts){
 const base=Math.floor(total/parts);
 const rem=total%parts;
 return Array.from({length:parts},(_,i)=>base+(i<rem?1:0));
}

function assessmentToUnits(item){
 const units=[];
 const label=`${item.title}`;
 const mode=item.assessmentMode||assessmentModeFromCourse();
 const thCount=Math.max(0,Number(item.periodsTH||0));
 const ktCount=Math.max(0,Number(item.periodsKT||0));

 // Phần tiết quy đổi dư của kiểm tra Thực hành/Tích hợp được tính vào cột TH,
 // nhưng KHÔNG mang nhãn "Kiểm tra" để tránh lặp chữ Kiểm tra trên Sổ đầu bài.
 for(let i=0;i<thCount;i++){
   units.push({
     type:"TH",
     assessmentMode:mode,
     assessmentType:item.assessmentType||"Thực hành",
     assessmentSupport:true,
     lesson:"",
     items:[]
   });
 }

 // Chỉ phần giữ lại ở cột Kiểm tra mới hiển thị rõ mốc Kiểm tra.
 for(let i=0;i<ktCount;i++){
   units.push({
     type:"KT",
     assessmentMode:mode,
     assessmentType:item.assessmentType||(mode==="theory"?"Lý thuyết":"Thực hành"),
     assessmentIndex:i+1,
     assessmentCount:ktCount,
     lesson:label,
     items:[]
   });
 }
 return units;
}

function buildProgramUnits(){
 const units=[];
 programSequence.forEach(item=>{
   if(item.kind==="lesson") units.push(...lessonToUnits(item));
   else if(item.kind==="assessment") units.push(...assessmentToUnits(item));
 });
 return units;
}

function esc(s){return s.replace(/[&<>"&#x27;]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",&#x27;"&#x27;:"&quot;","&#x27;":"&#039;"}[m]))}
function fmt(d){return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`}
function weekdayName(d){
 const names=["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];
 return names[d.getDay()];
}


let exclusions=[];

function dateKey(d){
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}


function refreshScheduleAfterCalendarChange(){
  // Chỉ tự chia lại khi đã có dữ liệu chương trình và ngày bắt đầu.
  if(programSequence.length && document.getElementById("startDate").value){
    buildSchedule();
  }
}



function formatDateInput(el){
 let v=el.value.replace(/\D/g,"").slice(0,8);
 if(v.length>4) v=v.slice(0,2)+"/"+v.slice(2,4)+"/"+v.slice(4);
 else if(v.length>2) v=v.slice(0,2)+"/"+v.slice(2);
 el.value=v;
}

function displayDateToISO(v){
 const m=(v||"").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
 if(!m) return "";
 const d=Number(m[1]), mo=Number(m[2]), y=Number(m[3]);
 const dt=new Date(y,mo-1,d);
 if(dt.getFullYear()!==y || dt.getMonth()!==mo-1 || dt.getDate()!==d) return "";
 return `${String(y).padStart(4,"0")}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function getDraftExclusion(){
 const startText=document.getElementById("excludeStartDate").value.trim();
 const endText=document.getElementById("excludeEndDate").value.trim() || startText;
 if(!startText) return null;

 const start=displayDateToISO(startText);
 const end=displayDateToISO(endText);
 const reason=document.getElementById("excludeReason").value.trim();
 const type=document.getElementById("excludeType").value;

 if(!start || !end) return {invalid:true,startText,endText};
 if(end < start) return {invalid:true,start,end};
 return {start,end,reason:reason||"Ngày nghỉ",type,draft:true};
}

function getActiveExclusions(){
 const active=[...exclusions];
 const draft=getDraftExclusion();
 if(draft && !draft.invalid){
   const duplicate=active.some(x=>x.start===draft.start && x.end===draft.end);
   if(!duplicate) active.push(draft);
 }
 return active;
}

function onExclusionDraftChange(){
 const draft=getDraftExclusion();
 const endInput=document.getElementById("excludeEndDate");

 if(draft && draft.invalid){
   endInput.setCustomValidity("Ngày không hợp lệ. Nhập theo định dạng dd/mm/yyyy và bảo đảm ngày kết thúc không trước ngày bắt đầu.");
 }else{
   endInput.setCustomValidity("");
 }

 if(programSequence.length && document.getElementById("startDate").value && draft && !draft.invalid){
   buildSchedule();
 }
}

function addExclusion(){
 const draft=getDraftExclusion();
 if(!draft){
   alert("Vui lòng nhập ngày bắt đầu nghỉ theo định dạng dd/mm/yyyy.");
   return;
 }
 if(draft.invalid){
   alert("Khoảng ngày nghỉ không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy và kiểm tra ngày bắt đầu/kết thúc.");
   return;
 }

 const {start,end,reason,type}=draft;
 exclusions.push({start,end,reason,type});
 exclusions.sort((a,b)=>a.start.localeCompare(b.start));

 document.getElementById("excludeStartDate").value="";
 document.getElementById("excludeEndDate").value="";
 document.getElementById("excludeReason").value="";
 renderExclusions();
 refreshScheduleAfterCalendarChange();
}

function removeExclusion(index){
 exclusions.splice(index,1);
 renderExclusions();
 refreshScheduleAfterCalendarChange();
}

function clearExclusions(){
 exclusions=[];
 renderExclusions();
 refreshScheduleAfterCalendarChange();
}

function vnDate(s){
 return s.split("-").reverse().join("/");
}

function renderExclusions(){
 const box=document.getElementById("exclusionList");
 if(!exclusions.length){
   box.innerHTML=&#x27;<div style="padding:9px 10px;color:#64748b;font-size:13px">Chưa khai báo thời gian nghỉ.</div>&#x27;;
   return;
 }
 box.innerHTML=exclusions.map((x,i)=>{
   const tag=x.type==="holiday"
      ? &#x27;<span class="tag-holiday">Nghỉ lễ</span>&#x27;
      : &#x27;<span class="tag-school">Kế hoạch trường</span>&#x27;;
   const range=x.start===x.end ? vnDate(x.start) : `${vnDate(x.start)} → ${vnDate(x.end)}`;
   return `<div class="exclusion-item">
     <div><b>${range}</b></div>
     <div>${tag} ${esc(x.reason)}</div>
     <div><button class="gray" onclick="removeExclusion(${i})">Xóa</button></div>
   </div>`;
 }).join("");
}

function isExcludedDate(d){
 const key=dateKey(d);
 return getActiveExclusions().some(x=>key>=x.start && key<=x.end);
}

function nextScheduledDates(start, slots, needed){
 // Map cố định: thứ nào học bao nhiêu tiết thì giữ nguyên suốt khóa.
 const weekdayPeriods=new Map();
 slots.forEach(s=>weekdayPeriods.set(Number(s.day), Number(s.periods)));

 let dates=[];
 let d=new Date(start);
 let guard=0;

 while(dates.length<needed && guard<3000){
   const wd=d.getDay();

   // Chỉ xếp lịch nếu đúng một thứ đã khai báo và ngày đó không nằm trong kỳ nghỉ.
   if(weekdayPeriods.has(wd) && !isExcludedDate(d)){
     dates.push({
       date:new Date(d),
       weekday:wd,
       periods:weekdayPeriods.get(wd)
     });
   }

   // Ngày nghỉ chỉ bị bỏ qua. Không chuyển "quota tiết" của ngày nghỉ sang ngày kế tiếp.
   d.setDate(d.getDate()+1);
   guard++;
 }
 return dates;
}


function rawSessionItems(session){
  const out=[];
  (session?.units||[]).forEach(u=>{
    (u.items||[]).forEach(it=>{
      const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
      if(txt && !out.includes(txt)) out.push(txt);
    });
  });
  return out;
}

function displaySessionItems(sessionIndex){
  const session=currentSessions[sessionIndex];
  const current=rawSessionItems(session);
  const previous=sessionIndex>0 ? rawSessionItems(currentSessions[sessionIndex-1]) : [];

  return current.map(txt=>({
    raw:txt,
    display:previous.includes(txt) ? `${txt} (tiếp theo)` : txt
  }));
}

function buildSchedule(){
 if(!programSequence.length){
   alert("Chưa có dữ liệu Chương trình môn học để chia lịch.");
   return;
 }
 recalcAssessments();

 const units=buildProgramUnits();
 if(!units.length){
   alert("Chưa có số tiết hợp lệ. Vui lòng kiểm tra bảng phân phối thời gian trong Chương trình môn học.");
   return;
 }

 const slots=[...document.querySelectorAll(".slot")].map(s=>({
   day:Number(s.querySelector(".weekday").value),
   periods:Number(s.querySelector(".periods").value)||0
 })).filter(x=>x.periods>0);

 if(!slots.length){
   alert("Vui lòng khai báo ít nhất 1 buổi học trong tuần.");
   return;
 }

 const unique=new Set(slots.map(x=>x.day));
 if(unique.size!==slots.length){
   alert("Các buổi trong tuần không được chọn trùng cùng một thứ.");
   return;
 }

 const weeklyPeriods=slots.reduce((s,x)=>s+x.periods,0);
 const estimatedWeeks=Math.ceil(units.length/Math.max(1,weeklyPeriods));
 const needed=estimatedWeeks*slots.length+slots.length+10;

 const startValue=document.getElementById("startDate").value;
 if(!startValue){
   alert("Vui lòng chọn ngày bắt đầu.");
   return;
 }
 const start=new Date(startValue+"T00:00:00");
 const dates=nextScheduledDates(start,slots,needed);

 // Kiểm tra an toàn: số tiết của mỗi ngày phải đúng cấu hình của chính thứ đó.
 const weekdayConfig=new Map(slots.map(s=>[Number(s.day),Number(s.periods)]));
 for(const x of dates){
   const expected=weekdayConfig.get(x.date.getDay());
   if(expected!==x.periods){
     alert("Lỗi cấu hình lịch: số tiết của ngày "+fmt(x.date)+" không khớp với thứ trong tuần.");
     return;
   }
 }

 const sessions=[];
 let cursor=0,di=0;
 while(cursor<units.length && di<dates.length){
   const cap=dates[di].periods;
   sessions.push({
     date:dates[di].date,
     units:units.slice(cursor,Math.min(cursor+cap,units.length))
   });
   cursor+=cap;
   di++;
 }

 currentSessions=sessions;
 const tb=document.getElementById("tbody");
 tb.innerHTML="";

 sessions.forEach((s,si)=>{
   const c={LT:0,TH:0,KT:0};
   s.units.forEach(x=>c[x.type]++);

   let content="";

   // Nhóm đúng theo thứ tự xuất hiện:
   // TÊN BÀI -> các đề mục của chính bài đó -> rồi mới sang BÀI kế tiếp.
   const previousSession = si>0 ? currentSessions[si-1] : null;

   // Các đề mục đã xuất hiện ở buổi trước, lưu theo từng tên bài.
   const prevItemsByLesson = new Map();
   if(previousSession){
     (previousSession.units||[]).forEach(u=>{
       if(!prevItemsByLesson.has(u.lesson)) prevItemsByLesson.set(u.lesson,new Set());
       (u.items||[]).forEach(it=>{
         const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
         if(txt) prevItemsByLesson.get(u.lesson).add(txt);
       });
     });
   }

   const orderedLessons=[];
   (s.units||[]).forEach(u=>{
     if(u.lesson && !orderedLessons.includes(u.lesson)) orderedLessons.push(u.lesson);
   });

   orderedLessons.forEach(lessonName=>{
     content+=`<div class="lesson-title">${esc(lessonName)}</div>`;

     const shownThisLesson=new Set();

     (s.units||[]).filter(u=>u.lesson===lessonName).forEach(u=>{
       (u.items||[]).forEach(it=>{
         const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
         const cls=Array.isArray(it)?(it[0]||"major"):"major";
         if(!txt) return;

         // Trong cùng một buổi, cùng một đề mục của cùng một bài chỉ hiện 1 lần.
         if(shownThisLesson.has(txt)) return;
         shownThisLesson.add(txt);

         // Chỉ ghi "(tiếp theo)" nếu đúng đề mục của đúng bài đã xuất hiện ở buổi trước.
         const continued = prevItemsByLesson.get(lessonName)?.has(txt) || false;
         const displayTxt = continued ? `${txt} (tiếp theo)` : txt;

         content+=`<div class="${cls}">${esc(displayTxt)}</div>`;
       });
     });
   });

   const tr=document.createElement("tr");
   tr.innerHTML=`<td class="stt">${si+1}</td>
   <td class="date">${fmt(s.date)}<br><span style="font-size:11px;color:#64748b">${weekdayName(s.date)}</span></td>
   <td class="small">${c.LT||0}</td>
   <td class="small">${c.TH||0}</td>
   <td class="small">${c.KT||0}</td>
   <td class="content">${content}
   <div style="margin-top:8px">
     <button type="button" onclick="sendSessionToPlanner(${si})" style="padding:6px 9px;font-size:12px;background:#7c3aed">SOẠN GIÁO ÁN BUỔI NÀY</button>
   </div>
   </td>
   <td class="absent"></td>
   <td class="sign"></td>`;
   tb.appendChild(tr);
 });
 autoSaveActiveWorkSession();
}


function sendSessionToPlanner(index){
 const s=currentSessions[index];
 if(!s){ alert("Không tìm thấy buổi học."); return; }

 // "Tên bài học trước" lấy đúng từ TT ngay trước trong Sổ đầu bài.
 // TT 1 không có bài học trước.
 let previousLesson="";
 let previousLessonTitle="";
 let previousLessonItems=[];
 if(index>0 && currentSessions[index-1]){
   const prev=currentSessions[index-1];
   const prevLessons=[...new Set((prev.units||[]).map(u=>u.lesson).filter(Boolean))];
   previousLessonTitle=prevLessons.join(" + ");

   // Lấy toàn bộ đề mục/tiểu mục thực sự đã dạy ở TT liền trước.
   previousLessonItems=displaySessionItems(index-1).map(x=>x.display);

   // Chuỗi dùng cho trường Tên bài học trước: Tên bài + toàn bộ đề mục đã dạy hôm đó.
   previousLesson = previousLessonTitle;
   if(previousLessonItems.length){
     previousLesson += "\n" + previousLessonItems.join("\n");
   }
 }

 const counts={LT:0,TH:0,KT:0};
 s.units.forEach(u=>counts[u.type]=(counts[u.type]||0)+1);

 const lessons=[...new Set(s.units.map(u=>u.lesson).filter(Boolean))];

 // Giữ nguyên cấu trúc hiển thị của Sổ đầu bài:
 // Tên bài -> các đề mục của bài đó -> rồi mới sang bài kế tiếp.
 const lessonGroups=[];
 const prevSession=index>0 ? currentSessions[index-1] : null;
 const prevByLesson=new Map();

 if(prevSession){
   (prevSession.units||[]).forEach(u=>{
     if(!prevByLesson.has(u.lesson)) prevByLesson.set(u.lesson,new Set());
     (u.items||[]).forEach(it=>{
       const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
       if(txt) prevByLesson.get(u.lesson).add(txt);
     });
   });
 }

 lessons.forEach(lessonName=>{
   const groupItems=[];
   const seen=new Set();

   (s.units||[]).filter(u=>u.lesson===lessonName).forEach(u=>{
     (u.items||[]).forEach(it=>{
       const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
       if(!txt || seen.has(txt)) return;
       seen.add(txt);

       // Chỉ ghi "(tiếp theo)" nếu đúng đề mục của đúng bài đã có ở buổi trước.
       const continued=prevByLesson.get(lessonName)?.has(txt) || false;
       groupItems.push(continued ? `${txt} (tiếp theo)` : txt);
     });
   });

   lessonGroups.push({
     lesson:lessonName,
     items:groupItems
   });
 });

 const items=[];
 const orderedLessons=[...new Set((s.units||[]).map(u=>u.lesson).filter(Boolean))];
 orderedLessons.forEach(lessonName=>{
   const seen=new Set();
   (s.units||[]).filter(u=>u.lesson===lessonName).forEach(u=>{
     (u.items||[]).forEach(it=>{
       const txt=Array.isArray(it)?String(it[1]||"").trim():String(it||"").trim();
       if(!txt || seen.has(txt)) return;
       seen.add(txt);
       const continued=prevByLesson.get(lessonName)?.has(txt) || false;
       items.push(continued ? `${txt} (tiếp theo)` : txt);
     });
   });
 });

 // An toàn dữ liệu: nếu là buổi thuộc một Bài mà chưa có đề mục,
 // lấy đề mục tương ứng trực tiếp từ chương trình để không truyền buổi rỗng sang Bước 2.
 if(!items.length){
   const lessonNames=[...new Set((s.units||[]).map(u=>u.lesson).filter(Boolean))];
   lessonNames.forEach(name=>{
     const lessonObj=programSequence.find(x=>x.kind==="lesson" && x.title===name);
     if(lessonObj && lessonObj.items && lessonObj.items.length){
       const first=lessonObj.items[0];
       const txt=Array.isArray(first)?first[1]:String(first||"");
       if(txt && !items.includes(txt)) items.push(txt);
     }
   });
 }

 const payload={
   source:"so-dau-bai",
   courseMode:courseMode,
   courseModeLabel:courseModeLabel(),
   assessmentType:(counts.KT||0)>0?(assessmentModeFromCourse()==="theory"?"Lý thuyết":"Thực hành"):"",
   courseName:course.name||"",
   courseCode:course.code||"",
   date:fmt(s.date),
   weekday:weekdayName(s.date),
   periods:s.units.length,
   lt:counts.LT||0,
   th:counts.TH||0,
   kt:counts.KT||0,
   lessons,
   lessonGroups,
   items,
   previousLesson,
   previousLessonTitle,
   previousLessonItems,
   scheduleTT:index+1,

   // Gửi toàn bộ chương trình môn học đã đọc ở Bước 1 sang Bước 2 để xem lại.
   fullCourse:{
     name:course.name||"",
     code:course.code||"",
     total:Number(course.total||0),
     lt:Number(course.lt||0),
     th:Number(course.th||0),
     kt:Number(course.kt||0)
   },
   fullProgram:programSequence.map(x=>JSON.parse(JSON.stringify(x))),

   summaryText:lessons.join(" | ") + (items.length ? " | " + items.join(" | ") : "")
 };

 parent.postMessage({type:"OPEN_LESSON_PLAN_FROM_SCHEDULE",payload},"*");
}
const WORK_SESSION_STORE="so_dau_bai_work_sessions_v1";
const WORK_SESSION_LAST="so_dau_bai_last_session_v1";
let activeWorkSessionId="";

function readWorkSessions(){
  try{
    const raw=localStorage.getItem(WORK_SESSION_STORE);
    const obj=raw?JSON.parse(raw):{};
    return obj && typeof obj==="object" ? obj : {};
  }catch(e){ return {}; }
}
function writeWorkSessions(obj){
  localStorage.setItem(WORK_SESSION_STORE,JSON.stringify(obj));
}
function safeCloneData(v){
  return JSON.parse(JSON.stringify(v));
}
function collectWorkSessionState(){
  const slots=[...document.querySelectorAll(".slot")].map(s=>({
    day:Number(s.querySelector(".weekday").value),
    periods:Number(s.querySelector(".periods").value)||0
  }));
  return {
    version:2,
    courseMode:courseMode,
    course:safeCloneData(course),
    programSequence:safeCloneData(programSequence),
    startDate:document.getElementById("startDate").value||"",
    weeklyCount:Number(document.getElementById("weeklyCount").value)||slots.length||1,
    weeklySlots:slots,
    exclusions:safeCloneData(exclusions),
    savedAt:new Date().toISOString()
  };
}
function sessionDefaultName(){
  const code=String(course.code||"").trim();
  const name=String(course.name||"").trim();
  return [code,name,courseModeLabel()].filter(Boolean).join(" - ") || "Phiên làm việc";
}
function renderSavedSessionList(){
  const sel=document.getElementById("savedSessionSelect");
  if(!sel) return;
  const store=readWorkSessions();
  const entries=Object.entries(store).sort((a,b)=>String(b[1].savedAt||"").localeCompare(String(a[1].savedAt||"")));
  sel.innerHTML=entries.length ? entries.map(([id,x])=>`<option value="${esc(id)}">${esc(x.name||"Phiên làm việc")}</option>`).join("") : `<option value="">— Chưa có phiên đã lưu —</option>`;
  if(activeWorkSessionId && store[activeWorkSessionId]) sel.value=activeWorkSessionId;
  updateSavedSessionInfo();
}
function updateSavedSessionInfo(){
  const sel=document.getElementById("savedSessionSelect");
  const info=document.getElementById("savedSessionInfo");
  if(!sel||!info) return;
  const store=readWorkSessions();
  const x=store[sel.value];
  if(!x){
    info.textContent="Phiên được lưu trên trình duyệt của máy này, gồm chương trình môn học, lịch học, ngày nghỉ và Sổ đầu bài. Phiên gần nhất sẽ tự khôi phục khi mở lại ứng dụng.";
    return;
  }
  const dt=x.savedAt?new Date(x.savedAt):null;
  const when=dt && !isNaN(dt) ? dt.toLocaleString("vi-VN") : "";
  info.innerHTML=`<b>${esc(x.name||"Phiên làm việc")}</b>${when?` · lưu lúc ${esc(when)}`:""} · ${Number(x.state?.programSequence?.length||0)} mục chương trình.`;
}
function saveWorkSession(){
  if(!programSequence.length){ alert("Chưa có Chương trình môn học để lưu phiên."); return; }

  const store=readWorkSessions();
  const cleanName=sessionDefaultName();
  const currentCode=String(course.code||"").trim().toLowerCase();
  const currentName=String(course.name||"").trim().toLowerCase();

  // Nếu phiên đang mở đúng môn hiện tại thì cập nhật chính phiên đó.
  let id="";
  if(activeWorkSessionId && store[activeWorkSessionId]){
    const activeCourse=store[activeWorkSessionId]?.state?.course||{};
    const activeCode=String(activeCourse.code||"").trim().toLowerCase();
    const activeName=String(activeCourse.name||"").trim().toLowerCase();
    if((currentCode && activeCode===currentCode) || (!currentCode && currentName && activeName===currentName)){
      id=activeWorkSessionId;
    }
  }

  // Nếu chưa có phiên đang mở đúng môn, tìm phiên đã lưu của chính môn này để cập nhật,
  // tránh tạo nhiều phiên trùng tên khi người dùng làm việc với nhiều môn.
  if(!id){
    const found=Object.entries(store).find(([sid,x])=>{
      const c=x?.state?.course||{};
      const code=String(c.code||"").trim().toLowerCase();
      const name=String(c.name||"").trim().toLowerCase();
      return (currentCode && code===currentCode) || (!currentCode && currentName && name===currentName);
    });
    if(found) id=found[0];
  }

  if(!id) id="ws_"+Date.now()+"_"+Math.random().toString(36).slice(2,7);

  store[id]={name:cleanName,savedAt:new Date().toISOString(),state:collectWorkSessionState()};
  store[id].state.savedAt=store[id].savedAt;
  writeWorkSessions(store);
  activeWorkSessionId=id;
  localStorage.setItem(WORK_SESSION_LAST,id);
  renderSavedSessionList();
  alert("Đã lưu phiên làm việc: "+cleanName);
}
function autoSaveActiveWorkSession(){
  if(!activeWorkSessionId || !programSequence.length) return;
  const store=readWorkSessions();
  if(!store[activeWorkSessionId]) return;
  store[activeWorkSessionId].savedAt=new Date().toISOString();
  store[activeWorkSessionId].state=collectWorkSessionState();
  store[activeWorkSessionId].state.savedAt=store[activeWorkSessionId].savedAt;
  writeWorkSessions(store);
  localStorage.setItem(WORK_SESSION_LAST,activeWorkSessionId);
  renderSavedSessionList();
}
function applyWorkSessionState(state){
  if(!state || !Array.isArray(state.programSequence)) throw new Error("Dữ liệu phiên không hợp lệ.");
  courseMode=state.courseMode||""; const modeEl=document.getElementById("courseMode");if(modeEl)modeEl.value=courseMode; onCourseModeChange();
  course=safeCloneData(state.course||{name:"",code:"",total:0,lt:0,th:0,kt:0});
  programSequence=safeCloneData(state.programSequence||[]);
  lessons=programSequence.filter(x=>x.kind==="lesson");
  exclusions=safeCloneData(state.exclusions||[]);

  document.getElementById("startDate").value=state.startDate||"";
  document.getElementById("weeklyCount").value=String(Math.max(1,Math.min(7,Number(state.weeklyCount)||1)));
  renderWeeklySlots();

  const slots=[...document.querySelectorAll(".slot")];
  (state.weeklySlots||[]).forEach((x,i)=>{
    if(!slots[i]) return;
    slots[i].querySelector(".weekday").value=String(x.day);
    slots[i].querySelector(".periods").value=String(x.periods);
  });

  document.getElementById("excludeStartDate").value="";
  document.getElementById("excludeEndDate").value="";
  document.getElementById("excludeReason").value="";
  renderExclusions();
  updateCourseCards();
  renderConversionPreview();
  updateWeeklyCheck();
  document.getElementById("fileStatus").innerHTML=`<b>Đã khôi phục phiên đã lưu.</b> Không cần tải lại file chương trình môn học.`;
  if(programSequence.length && state.startDate) buildSchedule();
}
function loadWorkSessionById(id,quiet=false){
  const store=readWorkSessions();
  const item=store[id];
  if(!item) return false;
  try{
    activeWorkSessionId=id;
    applyWorkSessionState(item.state);
    localStorage.setItem(WORK_SESSION_LAST,id);
    renderSavedSessionList();
    if(!quiet) alert("Đã mở phiên: "+(item.name||"Phiên làm việc"));
    return true;
  }catch(e){
    if(!quiet) alert("Không mở được phiên: "+e.message);
    return false;
  }
}
function loadSelectedWorkSession(){
  const id=document.getElementById("savedSessionSelect")?.value||"";
  if(!id){ alert("Chưa có phiên để mở."); return; }
  loadWorkSessionById(id,false);
}
function deleteSelectedWorkSession(){
  const sel=document.getElementById("savedSessionSelect");
  const id=sel?.value||"";
  if(!id){ alert("Chưa có phiên để xóa."); return; }
  const store=readWorkSessions();
  const item=store[id];
  if(!confirm(`Xóa phiên "${item?.name||"Phiên làm việc"}"?`)) return;
  delete store[id];
  writeWorkSessions(store);
  if(activeWorkSessionId===id) activeWorkSessionId="";
  if(localStorage.getItem(WORK_SESSION_LAST)===id) localStorage.removeItem(WORK_SESSION_LAST);
  renderSavedSessionList();
}
function restoreLastWorkSession(){
  renderSavedSessionList();
  const id=localStorage.getItem(WORK_SESSION_LAST)||"";
  if(id) loadWorkSessionById(id,true);
}

function exportExcel(){
 const table=document.getElementById("mainTable").outerHTML;
 const css=`<style>table{border-collapse:collapse;width:100%;font-family:"Times New Roman";font-size:12pt}th,td{border:1px solid #000;padding:5px;vertical-align:middle}th{text-align:center;font-weight:bold}.stt,.date,.small,.absent,.sign{text-align:center}.content{vertical-align:top}.lesson-title,.major{font-weight:bold}.sub{margin-left:18px}
.exclusions{margin-top:12px}
.exclusion-row{display:grid;grid-template-columns:160px 1fr 90px;gap:8px;align-items:end;margin-bottom:8px}
.exclusion-list{margin-top:10px;border:1px solid #d9e1ec;border-radius:9px;overflow:hidden}
.exclusion-item{display:grid;grid-template-columns:120px 1fr 90px;gap:8px;padding:8px 10px;border-bottom:1px solid #e5e7eb;align-items:center}
.exclusion-item:last-child{border-bottom:0}
.tag-holiday{display:inline-block;padding:2px 7px;border-radius:999px;background:#fee2e2;color:#b91c1c;font-size:12px;font-weight:700}
.tag-school{display:inline-block;padding:2px 7px;border-radius:999px;background:#ede9fe;color:#6d28d9;font-size:12px;font-weight:700}
@media(max-width:700px){.exclusion-row,.exclusion-item{grid-template-columns:1fr}}

</style>`;
 const xls=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8">${css}</head><body>${table}</body></html>`;
 const blob=new Blob(["\ufeff",xls],{type:"application/vnd.ms-excel;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="So_dau_bai_"+(course.code||"mon_hoc")+".xls";document.body.appendChild(a);a.click();document.body.removeChild(a);
}
updateCourseCards();
renderConversionPreview();
renderWeeklySlots();
renderExclusions();
document.getElementById("tbody").innerHTML="";
restoreLastWorkSession();


// Expose ScheduleModule globally
window.ScheduleModule = {
  courseModeLabel,
  assessmentModeFromCourse,
  onCourseModeChange,
  conversionSummary,
  convertedTotal,
  updateCourseCards,
  normalizeLines,
  exactKey,
  getExactCellLines,
  parseCourseInfo,
  parseDetailItems,
  numbered,
  cellNumber,
  parseProgramTable,
  recalcAssessments,
  renderConversionPreview,
  readProgramFile,
  renderWeeklySlots,
  updateWeeklyCheck,
  balancedTypes,
  lessonToUnits,
  distributeItemCounts,
  assessmentToUnits,
  buildProgramUnits,
  esc,
  fmt,
  weekdayName,
  dateKey,
  refreshScheduleAfterCalendarChange,
  formatDateInput,
  displayDateToISO,
  getDraftExclusion,
  getActiveExclusions,
  onExclusionDraftChange,
  addExclusion,
  removeExclusion,
  clearExclusions,
  vnDate,
  renderExclusions,
  isExcludedDate,
  nextScheduledDates,
  rawSessionItems,
  displaySessionItems,
  buildSchedule,
  sendSessionToPlanner,
  readWorkSessions,
  writeWorkSessions,
  safeCloneData,
  collectWorkSessionState,
  sessionDefaultName,
  renderSavedSessionList,
  updateSavedSessionInfo,
  saveWorkSession,
  autoSaveActiveWorkSession,
  applyWorkSessionState,
  loadWorkSessionById,
  loadSelectedWorkSession,
  deleteSelectedWorkSession,
  restoreLastWorkSession,
  exportExcel,
  chiaLich: function() {
    buildSchedule();
  }
};


// Expose all handlers to global window for inline HTML onclick/onchange
if (typeof window !== 'undefined') {
  window.onCourseModeChange = onCourseModeChange;
  window.readProgramFile = readProgramFile;
  window.renderWeeklySlots = renderWeeklySlots;
  window.updateWeeklyCheck = updateWeeklyCheck;
  window.onExclusionDraftChange = onExclusionDraftChange;
  window.addExclusion = addExclusion;
  window.removeExclusion = removeExclusion;
  window.clearExclusions = clearExclusions;
  window.formatDateInput = formatDateInput;
  window.buildSchedule = buildSchedule;
  window.chiaLich = buildSchedule;
  window.exportExcel = exportExcel;
  window.saveWorkSession = saveWorkSession;
  window.loadSelectedWorkSession = loadSelectedWorkSession;
  window.deleteSelectedWorkSession = deleteSelectedWorkSession;
  window.restoreLastWorkSession = restoreLastWorkSession;
  window.sendSessionToPlanner = sendSessionToPlanner;
  window.openLessonPlan = sendSessionToPlanner;
}

function initSchedule() {
  try {
    if (typeof renderWeeklySlots === 'function') renderWeeklySlots();
    if (typeof renderExclusions === 'function') renderExclusions();
    if (typeof renderSavedSessionList === 'function') renderSavedSessionList();
    if (typeof updateWeeklyCheck === 'function') updateWeeklyCheck();
    if (typeof restoreLastWorkSession === 'function') restoreLastWorkSession();
  } catch (err) {
    console.warn("Schedule init error:", err);
  }
}

// Auto run on load or DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedule);
  } else {
    initSchedule();
  }
}
