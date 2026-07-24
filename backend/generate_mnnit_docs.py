import os
import sys
import asyncio
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import UploadFile
from backend.services.document_service import get_document_service

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_documents"
os.makedirs(SAMPLE_DIR, exist_ok=True)

def create_pdf(filename: str, title: str, subtitle: str, sections: list):
    pdf_path = SAMPLE_DIR / filename
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1, # Center
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=15
    )

    sec_title_style = ParagraphStyle(
        'SecTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    story = []
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=12))

    for sec in sections:
        story.append(Paragraph(sec['heading'], sec_title_style))
        for para in sec['content']:
            story.append(Paragraph(para, body_style))
        story.append(Spacer(1, 4))

    doc.build(story)
    print(f"Generated PDF: {filename}")

def build_all_mnnit_pdfs():
    docs_data = [
        {
            "filename": "MNNIT_Academic_Regulations_2026.pdf",
            "title": "Motilal Nehru National Institute of Technology Allahabad",
            "subtitle": "Official Academic Regulations & Grading Guidelines 2025-2026",
            "sections": [
                {
                    "heading": "Section 1: Attendance Requirements & Leave Rules",
                    "content": [
                        "Students registered in B.Tech, M.Tech, MCA, and MBA programs at MNNIT Allahabad must maintain a minimum of 75% attendance in all theory and laboratory courses.",
                        "A maximum relaxation of 10% attendance (allowing down to 65%) may be granted by the Dean (Academic) strictly on medical grounds, subject to submitting official medical certificates within 7 days of returning to campus.",
                        "Students failing to achieve the 75% threshold (or 65% with approved medical leave) will be awarded an 'F' grade for short attendance and debarred from end-semester examinations."
                    ]
                },
                {
                    "heading": "Section 2: Grading System & Performance Metrics (SPI / CPI)",
                    "content": [
                        "MNNIT Allahabad follows a 10-point absolute grading scale. Grades awarded are A+ (10), A (9), B+ (8), B (7), C+ (6), C (5), D (4), and F (0).",
                        "Semester Performance Index (SPI) and Cumulative Performance Index (CPI) are calculated at the end of each semester.",
                        "The minimum CPI required for the award of B.Tech degree is 5.0, with no pending backlog courses."
                    ]
                },
                {
                    "heading": "Section 3: Branch Change Rules for B.Tech Students",
                    "content": [
                        "Branch change is permitted at the end of the 2nd semester based purely on CPI merit achieved in the 1st year.",
                        "Minimum eligibility for branch change: Student must have a CPI of 8.50 or above, with no backlog/failed courses.",
                        "The strength of any branch shall not increase beyond 10% of its sanctioned intake or fall below 85% of its sanctioned intake."
                    ]
                }
            ]
        },
        {
            "filename": "MNNIT_Fee_Structure_2025_26.pdf",
            "title": "Motilal Nehru National Institute of Technology Allahabad",
            "subtitle": "Official Institute & Hostel Fee Structure Academic Year 2025-2026",
            "sections": [
                {
                    "heading": "Section 1: B.Tech Tuition & Semester Fees",
                    "content": [
                        "Tuition Fee for Open / OBC / EWS students with annual family income > Rs. 5.0 Lakhs is Rs. 62,500 per semester.",
                        "Tuition Fee Concession for General/OBC/EWS students with annual family income between Rs. 1.0 Lakh and 5.0 Lakhs: 2/3rd fee remission (Payable Tuition Fee: Rs. 20,833 per semester).",
                        "100% Tuition Fee Waiver is granted to SC / ST / PwD students and students with annual family income < Rs. 1.0 Lakh."
                    ]
                },
                {
                    "heading": "Section 2: Other Institute Charges",
                    "content": [
                        "Institute Other Charges (Examination fee, Library fee, Student Activity fee, Building Fund, Medical Insurance): Rs. 14,500 per semester.",
                        "One-time Security Deposit (Refundable at degree completion): Rs. 5,000."
                    ]
                },
                {
                    "heading": "Section 3: Hostel & Mess Fee Schedule",
                    "content": [
                        "Hostel Seat Rent and Maintenance Charges: Rs. 12,000 per semester across all boys and girls hostels.",
                        "Advance Mess Fee: Rs. 25,000 per semester (Adjusted against actual monthly mess bills).",
                        "Fee Payment Deadline: Fees must be paid online via SBI Collect on or before July 31st (Autumn semester) and December 31st (Spring semester). Late payment fee of Rs. 500 per week applies thereafter."
                    ]
                }
            ]
        },
        {
            "filename": "MNNIT_Hostel_and_Mess_Rules.pdf",
            "title": "Motilal Nehru National Institute of Technology Allahabad",
            "subtitle": "Hostel Residence Rules, Entry Timings & Mess Conduct Guidelines",
            "sections": [
                {
                    "heading": "Section 1: Hostel Allotment & Facilities",
                    "content": [
                        "Fresh B.Tech 1st year boys are allotted Swami Vivekananda Boys Hostel (SVBH). Senior boys are allotted Tandon, Malaviya, and Raman Hostels.",
                        "Girls students are accommodated in Sarojini Naidu, Kamala Nehru, and PG Girls Hostels.",
                        "High-speed Wi-Fi, LAN connectivity, study rooms, and sports facilities are available in all hostels."
                    ]
                },
                {
                    "heading": "Section 2: Campus Gate Timings & Night Out Rules",
                    "content": [
                        "Main Institute Gate Curfew is strictly 10:00 PM for all residential students.",
                        "Girls Hostel gate curfew is 9:30 PM on weekdays and 10:00 PM on weekends.",
                        "Any night out or leave from hostel requires prior online approval from Warden/Chief Warden via the Student Portal."
                    ]
                },
                {
                    "heading": "Section 3: Mess Rules & Rebate Policy",
                    "content": [
                        "Mess attendance is compulsory for all hostel inmates. Meals served include Breakfast, Lunch, Evening Snacks, and Dinner.",
                        "Mess rebate of Rs. 120 per day is granted if a student is absent continuously for 3 or more days with prior approved leave."
                    ]
                },
                {
                    "heading": "Section 4: Strict Anti-Ragging Policy",
                    "content": [
                        "MNNIT Allahabad maintains a ZERO TOLERANCE policy towards ragging.",
                        "Any student found guilty of ragging will face immediate expulsion from the institute and criminal prosecution under IPC."
                    ]
                }
            ]
        },
        {
            "filename": "MNNIT_Examination_and_Evaluation_Rules.pdf",
            "title": "Motilal Nehru National Institute of Technology Allahabad",
            "subtitle": "Mid-Semester, End-Semester & Answer Script Inspection Guidelines",
            "sections": [
                {
                    "heading": "Section 1: Weightage & Evaluation Scheme",
                    "content": [
                        "Continuous Evaluation Scheme: Mid-Semester Exam (30%), End-Semester Exam (50%), Internal Teacher Assessment / Quizzes / Assignments (20%).",
                        "Minimum passing score: Student must secure at least 35% marks in End-Semester Exam and 40% overall in aggregate to pass a course."
                    ]
                },
                {
                    "heading": "Section 2: Answer Script Inspection & Re-evaluation",
                    "content": [
                        "Students are shown evaluated Mid-Sem and End-Sem answer scripts by course instructors before final grade submission.",
                        "Formal application for re-totalling/re-evaluation can be submitted within 10 days of result publication with a fee of Rs. 500 per subject."
                    ]
                },
                {
                    "heading": "Section 3: Backlog & Supplementary Examinations",
                    "content": [
                        "Supplementary exams are held in July for students with 'F' grades in Autumn and Spring semester courses.",
                        "Maximum grade awarded in a supplementary exam is capped at 'C+' grade."
                    ]
                }
            ]
        },
        {
            "filename": "MNNIT_Scholarships_and_Financial_Aid.pdf",
            "title": "Motilal Nehru National Institute of Technology Allahabad",
            "subtitle": "Merit Scholarships, MCM Assistance & Financial Aid Schemes",
            "sections": [
                {
                    "heading": "Section 1: Merit-cum-Means (MCM) Scholarship",
                    "content": [
                        "Awarded to top 25% of B.Tech students based on CPI and family income (< Rs. 5.0 Lakhs).",
                        "Benefits: Complete tuition fee waiver plus Rs. 1,000 per month stipend for 10 months."
                    ]
                },
                {
                    "heading": "Section 2: National & State Scholarship Schemes",
                    "content": [
                        "Students can apply for National Scholarship Portal (NSP) schemes (PM-YASASPI, Central Sector Scheme).",
                        "UP Post-Matric Scholarship is applicable for eligible domicile students of Uttar Pradesh."
                    ]
                },
                {
                    "heading": "Section 3: Alumni & Corporate Scholarships",
                    "content": [
                        "MNNIT Alumni Association provides emergency financial assistance and laptops to needy meritorious students.",
                        "Corporate scholarships are offered by OP Jindal Engineering Award (OPJEM), Coal India, and POSOCO."
                    ]
                }
            ]
        },
        {
            "filename": "MNNIT_Training_and_Placement_Rules.pdf",
            "title": "Motilal Nehru National Institute of Technology Allahabad",
            "subtitle": "Training & Placement Cell (TPC) Campus Recruitment Policy",
            "sections": [
                {
                    "heading": "Section 1: One Student One Job Policy",
                    "content": [
                        "MNNIT Placement Cell enforces a 'One Student One Job' policy to ensure maximum student placement.",
                        "Dream Job Exception: A placed student is allowed to apply for a 'Dream Company' if the salary package offered is at least 1.5 times (150%) of their existing job offer."
                    ]
                },
                {
                    "heading": "Section 2: Eligibility & Code of Conduct",
                    "content": [
                        "Students with active backlogs may be restricted from participating in Tier-1 recruitment drives based on company criteria.",
                        "100% attendance is compulsory for pre-placement talks (PPT). Unexcused absence results in debarment for 2 consecutive placement drives."
                    ]
                }
            ]
        }
    ]

    for item in docs_data:
        create_pdf(item['filename'], item['title'], item['subtitle'], item['sections'])

async def index_all_mnnit_docs():
    build_all_mnnit_pdfs()
    doc_service = get_document_service()

    print("\nIndexing all MNNIT Allahabad documents into ChromaDB & Document Store...")
    for pdf_file in SAMPLE_DIR.glob("*.pdf"):
        with open(pdf_file, "rb") as f:
            upload_file = UploadFile(filename=pdf_file.name, file=f)
            meta = await doc_service.upload_document(upload_file)
            print(f"Indexed '{pdf_file.name}': {meta.page_count} pages, {meta.chunk_count} sections")

    print("\nSuccessfully generated and indexed MNNIT Allahabad official document suite!")

if __name__ == "__main__":
    asyncio.run(index_all_mnnit_docs())
