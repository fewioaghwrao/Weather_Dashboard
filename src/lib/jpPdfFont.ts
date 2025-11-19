// src/lib/jpPdfFont.ts
import jsPDF from "jspdf";
import NotoSansJPRegular from "./fonts/NotoSansJP-normal";

export function setupJpFont(doc: jsPDF) {
  // jsPDF にフォントファイルを登録
  (doc as any).addFileToVFS("NotoSansJP-Regular.ttf", NotoSansJPRegular);
  (doc as any).addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");

  // 以後の text はこのフォントで描画
  doc.setFont("NotoSansJP", "normal");
}
