import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf(filename: str, title: str, sections: list):
    output_path = Path(__file__).parent / filename
    doc = SimpleDocTemplate(str(output_path), pagesize=letter)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        spaceAfter=14
    )
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        spaceAfter=8
    )

    story = [Paragraph(title, title_style), Spacer(1, 10)]

    for heading, text_blocks in sections:
        story.append(Paragraph(heading, section_style))
        for text in text_blocks:
            story.append(Paragraph(text, body_style))
            story.append(Spacer(1, 4))

    doc.build(story)
    print(f"Generated {output_path.name}")

if __name__ == "__main__":
    academic_sections = [
        ("Section 1: Attendance Requirement", [
            "Students are required to maintain a minimum of 75% attendance in all theory and practical courses registered in a semester to be eligible to appear for the end-semester examinations.",
            "A relaxation of up to 10% attendance may be granted by the Academic Dean on medical grounds, supported by valid official medical documentation submitted within 7 days of illness."
        ]),
        ("Section 2: Fee Structure and Payment Deadlines", [
            "Semester tuition fees must be paid in full on or before August 15th for the Fall semester and January 15th for the Spring semester.",
            "A late fee penalty of $50 per week will be levied for payments delayed beyond the official deadline up to a maximum of 4 weeks, after which registration may be suspended."
        ]),
        ("Section 3: Merit Scholarships", [
            "The university offers a 50% tuition waiver scholarship for students securing a CGPA of 9.0 or above at the end of every academic year.",
            "Special Need-based scholarships covering up to 100% of hostel and tuition fees are available upon application to the Financial Aid Office."
        ])
    ]

    hostel_sections = [
        ("Section 1: Hostel Entry and Curfew Timings", [
            "All residential hostel students must return to their designated hostel premises by 9:30 PM on weekdays (Monday to Friday) and 10:30 PM on weekends (Saturday and Sunday).",
            "Late entry beyond curfew hours requires prior written authorization from the Chief Warden. Unauthorized late entry will result in a warning fine of $25."
        ]),
        ("Section 2: Visitor and Guest Policy", [
            "Visitors and day scholars are permitted in the common hostel reception area between 4:00 PM and 7:00 PM only.",
            "Overnight guest stays in student rooms are strictly prohibited without prior written permission from the Residence Life Coordinator."
        ]),
        ("Section 3: Mess Rules and Meal Timings", [
            "Breakfast is served from 7:30 AM to 9:00 AM, Lunch from 12:00 PM to 2:00 PM, and Dinner from 7:30 PM to 9:00 PM daily.",
            "Hostel mess fees are non-refundable. Students proceeding on approved leave for more than 5 consecutive days can apply for mess rebate."
        ])
    ]

    exam_sections = [
        ("Section 1: Examination Eligibility & Admit Card", [
            "Only students who have cleared all university dues and satisfied the 75% attendance criterion will be issued official examination hall tickets.",
            "Students must carry their valid University Student ID card and printed Hall Ticket to every examination session."
        ]),
        ("Section 2: Passing Criteria and Grading System", [
            "The minimum passing mark in any course is 40% combined across continuous internal assessments and end-semester examinations.",
            "Grades are awarded on a 10-point relative scale ranging from O (Outstanding - 10) to F (Fail - 0)."
        ]),
        ("Section 3: Re-evaluation and Answer Script Inspection", [
            "Students dissatisfied with their end-semester marks may apply for re-evaluation or copy inspection within 15 days of result declaration.",
            "The application fee for answer script re-evaluation is $30 per course subject."
        ])
    ]

    generate_pdf("Academic_Regulations_2026.pdf", "Official Academic Regulations & Rules 2026", academic_sections)
    generate_pdf("Hostel_Rules_and_Policies.pdf", "University Hostel Rules and Living Policies", hostel_sections)
    generate_pdf("Examination_Guidelines.pdf", "University Examination Rules and Evaluation Guidelines", exam_sections)
