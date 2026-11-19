import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 815, "MGM's College of Engineering, Nanded — Department of CSE | AI Career & Skill Gap Advisor")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(40, 808, 555, 808)

        # Running Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(40, 42, 555, 42)

        footer_text = "Project Summary & Architecture Overview | Academic Year 2026-27"
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawString(40, 30, footer_text)
        self.drawRightString(555, 30, page_str)

        self.restoreState()

def build_pdf(filename="AI_Career_Skill_Gap_Advisor_Project_Summary.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    # Custom color palette
    c_primary = colors.HexColor("#1E1B4B")     # Deep indigo
    c_secondary = colors.HexColor("#4338CA")   # Vibrant purple-blue
    c_accent = colors.HexColor("#7C3AED")      # Bright purple
    c_emerald = colors.HexColor("#059669")     # Green
    c_dark = colors.HexColor("#0F172A")        # Text dark
    c_body = colors.HexColor("#334155")        # Text body
    c_bg_light = colors.HexColor("#F8FAFC")    # Slate light
    c_border = colors.HexColor("#E2E8F0")

    # Typography styles
    styles.add(ParagraphStyle(
        name='DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#FFFFFF"),
        alignment=1
    ))

    styles.add(ParagraphStyle(
        name='DocSubTitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#E0E7FF"),
        alignment=1
    ))

    styles.add(ParagraphStyle(
        name='DocMeta',
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#C7D2FE"),
        alignment=1
    ))

    styles.add(ParagraphStyle(
        name='SecHeader',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='SubSecHeader',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=c_secondary,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='BodyCustom',
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=c_body,
        spaceAfter=5
    ))

    styles.add(ParagraphStyle(
        name='BulletCustom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_body,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    ))

    styles.add(ParagraphStyle(
        name='CalloutText',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#065F46")
    ))

    styles.add(ParagraphStyle(
        name='TableHeading',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#FFFFFF"),
        alignment=0
    ))

    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=c_dark
    ))

    styles.add(ParagraphStyle(
        name='TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=c_dark
    ))

    story = []

    # =========================================================================
    # TITLE BANNER
    # =========================================================================
    banner_data = [
        [
            Paragraph("AI CAREER &amp; SKILL GAP ADVISOR", styles['DocTitle'])
        ],
        [
            Paragraph("Intelligent Placement Readiness Engine &amp; 4-Year Technical Career Roadmap", styles['DocSubTitle'])
        ],
        [
            Paragraph("Department of Computer Science &amp; Engineering &bull; MGM's College of Engineering, Nanded &bull; AY 2026-27", styles['DocMeta'])
        ]
    ]

    banner_table = Table(banner_data, colWidths=[515])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_primary),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,0), 4),
        ('BOTTOMPADDING', (0,1), (-1,1), 4),
        ('BOTTOMPADDING', (0,2), (-1,2), 8),
    ]))

    story.append(banner_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 1: PROJECT OVERVIEW & PROBLEM STATEMENT
    # =========================================================================
    story.append(Paragraph("1. Executive Summary &amp; Problem Statement", styles['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_secondary, spaceBefore=1, spaceAfter=6))

    p1 = ("In today's competitive campus placement ecosystem, engineering students face a substantial "
          "disconnect between theoretical college coursework and the rigorous practical standards expected by "
          "Tier-1 product companies (Google, Amazon, Microsoft) and IT enterprises (TCS Digital, Infosys DSE). "
          "Students often lack clarity on which skills they miss, what roadmaps to follow, and whether their "
          "coding abilities meet actual company cutoffs.")
    story.append(Paragraph(p1, styles['BodyCustom']))

    p2 = ("The <b>AI Career &amp; Skill Gap Advisor</b> solves this by delivering an automated, end-to-end "
          "career intelligence platform. It analyzes a student's acquired skills against live industry benchmarks, "
          "quantifies skill deficiencies into a dynamic <b>Placement Readiness Score (%)</b>, provides personalized "
          "4-year step-by-step milestone roadmaps, integrates hands-on problem solving on <b>LeetCode &amp; HackerRank</b>, "
          "evaluates submitted scores/screenshots with automated AI, and maintains student consistency via proactive reminders.")
    story.append(Paragraph(p2, styles['BodyCustom']))

    # Key Objectives Box
    callout_data = [[
        Paragraph("<b>Core Objectives:</b> (1) Automate skill gap identification against company benchmarks. "
                  "(2) Provide structured 4-stage pedagogical roadmaps (Learn &rarr; Practice &rarr; Assess &rarr; Certify). "
                  "(3) Enforce authentic hands-on coding practice on external portals with AI proof verification. "
                  "(4) Safeguard student identity via 6-digit numeric email OTP validation. "
                  "(5) Equip college placement cells (T&amp;P) with real-time analytics on student comprehension and readiness.", 
                  styles['CalloutText'])
    ]]
    callout_table = Table(callout_data, colWidths=[515])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ECFDF5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATIONS
    # =========================================================================
    story.append(Paragraph("2. System Architecture &amp; Technology Stack", styles['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_secondary, spaceBefore=1, spaceAfter=6))

    tech_data = [
        [
            Paragraph("Layer / Tier", styles['TableHeading']),
            Paragraph("Technology Stack", styles['TableHeading']),
            Paragraph("Key Responsibilities &amp; Implementations", styles['TableHeading'])
        ],
        [
            Paragraph("<b>Frontend (UI/UX)</b>", styles['TableCellBold']),
            Paragraph("React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti", styles['TableCell']),
            Paragraph("SPA architecture, SVG donut/pie charts, responsive candidate dashboards, streak tracking, screenshot compression.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Backend (API)</b>", styles['TableCellBold']),
            Paragraph("Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security 6", styles['TableCell']),
            Paragraph("RESTful controllers, weighted skill matching engine, role blueprint repositories, automated evaluation algorithms.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Security &amp; Auth</b>", styles['TableCellBold']),
            Paragraph("Stateless JWT, BCrypt, JavaMailSender (Email OTP)", styles['TableCell']),
            Paragraph("6-digit numeric OTP authentication sent via SMTP to student college inboxes; token-based session protection.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Database Layer</b>", styles['TableCellBold']),
            Paragraph("MySQL 8.0 Relational DB (Hibernate ORM / JDBC)", styles['TableCell']),
            Paragraph("Normalized schema: Users, Skills, StudentSkills, CareerRoles, OtpTokens, VerificationResults.", styles['TableCell'])
        ],
        [
            Paragraph("<b>External Integrations</b>", styles['TableCellBold']),
            Paragraph("LeetCode API / Study Plans, HackerRank Domains, GFG Sheets", styles['TableCell']),
            Paragraph("Direct platform problem linking, submission tracking, screenshot proof intake, and automated AI scoring.", styles['TableCell'])
        ]
    ]

    t_tech = Table(tech_data, colWidths=[110, 160, 245])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: KEY FUNCTIONAL MODULES
    # =========================================================================
    story.append(Paragraph("3. Core Functional Modules", styles['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_secondary, spaceBefore=1, spaceAfter=6))

    m_items = [
        ("<b>Module 1: Automated Skill Gap &amp; Weighted Readiness Engine:</b> "
         "Ingests target career tracks (Full Stack Java, AI/ML, DevOps, Data Science) and compares against candidate's "
         "selected and verified skills. Computes an exact <i>Placement Readiness Score</i> using weighted algorithmic formulas "
         "factoring in core language mastery, framework depth, and verified hands-on problem solving."),
        ("<b>Module 2: 4-Year Milestone Career Roadmaps:</b> "
         "Features a continuous pedagogical cycle: <i>Stage 1 (Learn)</i> provides free verified video courses and official docs; "
         "<i>Stage 2 (Practice)</i> routes students to LeetCode/HackerRank; <i>Stage 3 (Assess)</i> evaluates code approaches with "
         "time/space complexity analysis; <i>Stage 4 (Milestone Completion)</i> records feedback and updates student proficiency."),
        ("<b>Module 3: Company-Specific Hiring Blueprints &amp; Assessment Bank:</b> "
         "Curated blueprint library matching real hiring workflows for Google, Amazon, Microsoft, TCS, Infosys, and Qualcomm. "
         "Provides round-by-round assessment formats, algorithmic problem frequency tags, and technical OA questions."),
        ("<b>Module 4: Institutional Security with 6-Digit Email OTP:</b> "
         "Student accounts are verified via a one-time 6-digit numeric OTP sent directly to their email via JavaMailSender, "
         "ensuring strict data authenticity and preventing dummy candidate registrations.")
    ]

    for item in m_items:
        story.append(Paragraph(f"&bull; {item}", styles['BulletCustom']))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 4: GUIDE'S DEMO REVISIONS IMPLEMENTED (CHANGES 1 - 5)
    # =========================================================================
    story.append(Paragraph("4. Post-Demo Guide's Revisions (Detailed Implementation)", styles['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_secondary, spaceBefore=1, spaceAfter=6))

    revisions_data = [
        [
            Paragraph("Revision", styles['TableHeading']),
            Paragraph("Guide's Requirement", styles['TableHeading']),
            Paragraph("Engineered Solution &amp; Technical Verification", styles['TableHeading'])
        ],
        [
            Paragraph("<b>Change 1</b>", styles['TableCellBold']),
            Paragraph("Ask user for feedback &amp; rating after every assessment and completing each step.", styles['TableCell']),
            Paragraph("Created <b>FeedbackRatingModal.jsx</b> &amp; <b>feedbackService.js</b>. Prompts 1-5 star ratings, 3 understanding tiers (Deep, Moderate, Foundational), and 5 emotional sentiment states upon milestone completion.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Change 2</b>", styles['TableCellBold']),
            Paragraph("Advertise site usage, review, feedback to new users using graphs, pie charts, etc.", styles['TableCell']),
            Paragraph("Built <b>SiteUsageAndReviewsShowcase.jsx</b> with SVG Donut Chart (84% Deep Understanding), Feelings Bar Graph (72% Confident, 92%+ Placement Confidence), 4 metric cards, and verified real reviews (Ishwari, MGM COE CSE).", styles['TableCell'])
        ],
        [
            Paragraph("<b>Change 3</b>", styles['TableCellBold']),
            Paragraph("Suggest platforms like LeetCode &amp; HackerRank for hands-on practice, and ask students to share score/screenshot for AI analysis.", styles['TableCell']),
            Paragraph("Engineered <b>PracticePlatformModal.jsx</b> &amp; <b>practicePlatformService.js</b>. Integrated LeetCode 75 and HackerRank tracks. Features score entry, screenshot upload with canvas compression, and automated AI difficulty &amp; tier evaluation.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Change 4</b>", styles['TableCellBold']),
            Paragraph("After login ask every time to students: 'We provided you platform, did you visit and do practice or not?' so they remember.", styles['TableCell']),
            Paragraph("Implemented <b>PostLoginPracticeReminderModal.jsx</b>. Prompts authenticated students upon login session. If Yes &rarr; directs to score/screenshot upload; If Not Yet &rarr; provides 1-click launch to LeetCode/HackerRank.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Change 5</b>", styles['TableCellBold']),
            Paragraph("Ask students about virtual feedback using video or voice uploaded to social media with site link for outreach.", styles['TableCell']),
            Paragraph("Designed student video/voice review portal allowing students to paste verified social media links (LinkedIn, YouTube, Instagram) to showcase student testimonials and drive platform peer adoption.", styles['TableCell'])
        ]
    ]

    t_rev = Table(revisions_data, colWidths=[65, 175, 275])
    t_rev.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_rev)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 5: CODEBASE & ARTIFACT DIRECTORY MAP
    # =========================================================================
    story.append(Paragraph("5. Project Implementation File Mapping", styles['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_secondary, spaceBefore=1, spaceAfter=6))

    files_data = [
        [
            Paragraph("Component / File", styles['TableHeading']),
            Paragraph("Directory Path", styles['TableHeading']),
            Paragraph("Primary Role &amp; Logic", styles['TableHeading'])
        ],
        [
            Paragraph("<b>StudentDashboard.jsx</b>", styles['TableCellBold']),
            Paragraph("Frontend/src/components/", styles['TableCell']),
            Paragraph("Main student hub; displays skill gap cards, dream companies, readiness score, and Coding Practice Hub.", styles['TableCell'])
        ],
        [
            Paragraph("<b>PersonalizedRoadmap.jsx</b>", styles['TableCellBold']),
            Paragraph("Frontend/src/components/", styles['TableCell']),
            Paragraph("4-year sequential milestone roadmap; Stage 2 practice links and Stage 3 AI solution analysis.", styles['TableCell'])
        ],
        [
            Paragraph("<b>PracticePlatformModal.jsx</b>", styles['TableCellBold']),
            Paragraph("Frontend/src/components/", styles['TableCell']),
            Paragraph("LeetCode/HackerRank integration, score intake, screenshot upload, and automated AI evaluation engine.", styles['TableCell'])
        ],
        [
            Paragraph("<b>PostLoginPracticeReminderModal.jsx</b>", styles['TableCellBold']),
            Paragraph("Frontend/src/components/", styles['TableCell']),
            Paragraph("Daily consistency check-in modal; prompts students after login to ensure hands-on practice habits.", styles['TableCell'])
        ],
        [
            Paragraph("<b>SiteUsageAndReviewsShowcase.jsx</b>", styles['TableCellBold']),
            Paragraph("Frontend/src/components/", styles['TableCell']),
            Paragraph("Renders SVG donut pie charts, student sentiment bar graphs, and authentic verified student reviews.", styles['TableCell'])
        ],
        [
            Paragraph("<b>VirtualFeedbackModal.jsx</b>", styles['TableCellBold']),
            Paragraph("Frontend/src/components/", styles['TableCell']),
            Paragraph("Campus social media video/voice feedback portal; validates LinkedIn, YouTube, Instagram reel links and features student testimonials.", styles['TableCell'])
        ],
        [
            Paragraph("<b>StudentSkillController.java</b>", styles['TableCellBold']),
            Paragraph("Backend/src/main/java/.../controller/", styles['TableCell']),
            Paragraph("Spring Boot controller handling skill verification, proficiency levels, and student skill CRUD.", styles['TableCell'])
        ],
        [
            Paragraph("<b>EmailOtpService.java</b>", styles['TableCellBold']),
            Paragraph("Backend/src/main/java/.../service/", styles['TableCell']),
            Paragraph("JavaMailSender service generating and verifying 6-digit cryptographic numeric OTP codes via SMTP.", styles['TableCell'])
        ]
    ]

    t_files = Table(files_data, colWidths=[120, 160, 235])
    t_files.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_files)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: ACADEMIC VALUE & CONCLUSION
    # =========================================================================
    story.append(Paragraph("6. Academic Significance &amp; Institutional Impact", styles['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_secondary, spaceBefore=1, spaceAfter=6))

    concl_p = ("The <b>AI Career &amp; Skill Gap Advisor</b> provides a tangible technological asset for engineering "
               "institutions. By shifting students from passive syllabus memorization to active, verified problem solving "
               "on LeetCode and HackerRank, the platform directly increases campus placement conversion ratios. "
               "For academic evaluators and project guides, this system demonstrates rigorous software engineering, "
               "full-stack architectural integrity, real-time analytics, and practical industry alignment.")
    story.append(Paragraph(concl_p, styles['BodyCustom']))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {filename}")

if __name__ == "__main__":
    out_path = "AI_Career_Skill_Gap_Advisor_Project_Summary.pdf"
    if len(sys.argv) > 1:
        out_path = sys.argv[1]
    build_pdf(out_path)

