"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useResumeStore } from "../../store";
import { StepHeader, cardVariant } from "../navigation";
import {
  Search,
  Plus,
  Check,
  WandSparkles,
} from "lucide-react";
import styles from "../../builder.module.css";

interface SummaryTemplate {
  id: string;
  title: string;
  text: string;
}

const SUMMARY_TEMPLATES: SummaryTemplate[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    text: "Results-driven Software Engineer with 5+ years of experience designing, developing, and deploying scalable web applications. Proficient in modern JavaScript frameworks, cloud platforms, and CI/CD pipelines. Passionate about writing clean, maintainable code and collaborating with cross-functional teams to deliver high-impact solutions that drive business growth.",
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    text: "Creative UI/UX Designer with a focus on delivering impactful user experiences, eager to tackle dynamic challenges and apply creativity to craft intuitive interfaces. Demonstrated proficiency in project management, user-centric problem-solving, and seamless collaboration across teams. Skilled in leveraging state-of-the-art tools and methodologies to elevate product design and user engagement.",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    text: "Analytical Data Scientist skilled in machine learning, statistical modeling, and data visualization with 4+ years of experience transforming complex datasets into actionable business insights. Proficient in Python, R, and SQL with hands-on experience in TensorFlow and PyTorch. Adept at communicating findings to non-technical stakeholders and driving data-informed decision-making across organizations.",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    text: "Strategic Product Manager with a track record of launching successful digital products from concept to market. Experienced in conducting user research, defining product roadmaps, and aligning engineering and design teams around clear objectives. Strong analytical skills with a data-driven approach to prioritization and a passion for solving real customer problems.",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    text: "Detail-oriented DevOps Engineer experienced in building and maintaining robust CI/CD pipelines, cloud infrastructure, and containerized environments. Proficient in AWS, Docker, Kubernetes, and Terraform with a strong foundation in Linux systems and networking. Committed to automating workflows, improving system reliability, and reducing deployment lead times.",
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    text: "Passionate Frontend Developer specializing in building responsive, accessible, and high-performance web interfaces using React, TypeScript, and modern CSS frameworks. Strong eye for detail and commitment to pixel-perfect implementations. Experienced in optimizing Core Web Vitals, implementing design systems, and collaborating closely with designers and backend engineers.",
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    text: "Robust Backend Developer with expertise in designing RESTful APIs, microservices architectures, and database optimization. Proficient in Node.js, Python, and PostgreSQL with experience handling high-traffic production systems. Focused on building secure, scalable, and well-documented backend services that power seamless user experiences.",
  },
  {
    id: "fullstack-developer",
    title: "Full Stack Developer",
    text: "Versatile Full Stack Developer proficient in both frontend and backend technologies including React, Node.js, and cloud services. Proven ability to take projects from initial concept through deployment and iteration. Strong problem-solving skills with a passion for learning new technologies and delivering end-to-end solutions that delight users.",
  },
  {
    id: "mobile-developer",
    title: "Mobile Developer",
    text: "Innovative Mobile Developer with experience building native and cross-platform applications for iOS and Android using React Native and Swift. Skilled in designing intuitive user interfaces, optimizing app performance, and integrating third-party APIs. Committed to delivering polished, store-ready applications with excellent user ratings.",
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    text: "Certified Cloud Architect skilled in designing and implementing scalable, secure, and cost-effective cloud solutions on AWS and Azure. Experienced in migrating legacy systems to the cloud, architecting serverless applications, and establishing cloud governance frameworks. Strong ability to translate business requirements into technical architectures that drive efficiency.",
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    text: "Vigilant Cybersecurity Analyst with expertise in threat detection, incident response, and vulnerability assessment. Experienced in implementing security frameworks, conducting penetration testing, and ensuring regulatory compliance. Proactive approach to identifying risks and deploying countermeasures that protect organizational assets and data integrity.",
  },
  {
    id: "project-manager",
    title: "Project Manager",
    text: "Certified Project Manager with a proven track record of delivering complex projects on time and within budget. Skilled in Agile and Scrum methodologies, stakeholder communication, and risk management. Adept at leading cross-functional teams, managing scope changes, and ensuring alignment between project deliverables and business objectives.",
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    text: "Detail-oriented Business Analyst experienced in bridging the gap between business stakeholders and technical teams. Proficient in requirements gathering, process modeling, and data analysis using tools like SQL and Tableau. Strong communication skills with a track record of translating business needs into actionable technical specifications that drive project success.",
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    text: "Dynamic Marketing Manager with expertise in digital marketing strategies, brand management, and campaign optimization. Experienced in leveraging SEO, SEM, and social media channels to drive customer acquisition and retention. Data-driven approach to measuring ROI and continuously improving marketing performance across multiple channels.",
  },
  {
    id: "content-writer",
    title: "Content Writer",
    text: "Versatile Content Writer with a passion for crafting compelling narratives, informative articles, and engaging copy across diverse industries. Skilled in SEO optimization, editorial planning, and adapting tone and style to match brand voice. Proven ability to produce high-quality content that drives traffic, builds audience engagement, and supports business goals.",
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    text: "Analytical Financial Analyst skilled in financial modeling, forecasting, and variance analysis with 3+ years of experience in corporate finance. Proficient in Excel, Bloomberg Terminal, and SQL with strong capabilities in building valuation models and investment analyses. Detail-oriented professional with a track record of delivering actionable financial insights to support strategic decision-making.",
  },
  {
    id: "hr-manager",
    title: "HR Manager",
    text: "People-focused HR Manager with experience in talent acquisition, employee relations, and organizational development. Skilled in designing recruitment strategies, implementing performance management systems, and fostering inclusive workplace cultures. Strong communicator with a commitment to aligning HR initiatives with business objectives and employee well-being.",
  },
  {
    id: "sales-executive",
    title: "Sales Executive",
    text: "Goal-oriented Sales Executive with a history of exceeding targets and building lasting client relationships. Experienced in consultative selling, pipeline management, and CRM tools like Salesforce. Strong negotiation skills with a deep understanding of customer needs and market dynamics that drive revenue growth and client satisfaction.",
  },
  {
    id: "qa-engineer",
    title: "QA Engineer",
    text: "Meticulous QA Engineer experienced in manual and automated testing of web and mobile applications. Proficient in Selenium, Jest, and Cypress with a strong understanding of test-driven development and continuous integration. Committed to maintaining high quality standards through comprehensive test strategies, detailed bug reports, and close collaboration with development teams.",
  },
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    text: "Innovative AI/ML Engineer with expertise in developing and deploying machine learning models, natural language processing, and computer vision solutions. Proficient in Python, TensorFlow, and PyTorch with hands-on experience in MLOps and model optimization. Passionate about pushing the boundaries of artificial intelligence to solve real-world problems and create intelligent systems.",
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    text: "Creative Graphic Designer with a keen eye for visual storytelling and brand identity. Proficient in Adobe Creative Suite, Figma, and motion graphics with 4+ years of experience creating compelling designs for digital and print media. Adept at translating client briefs into impactful visuals that communicate ideas and captivate audiences.",
  },
  {
    id: "network-engineer",
    title: "Network Engineer",
    text: "Experienced Network Engineer skilled in designing, implementing, and managing complex network infrastructures. Proficient in Cisco, Juniper, and cloud networking solutions with strong expertise in TCP/IP, DNS, and firewall configurations. Committed to ensuring network reliability, security, and optimal performance across enterprise environments.",
  },
  {
    id: "database-administrator",
    title: "Database Administrator",
    text: "Detail-oriented Database Administrator with expertise in managing, optimizing, and securing relational and non-relational databases. Proficient in MySQL, PostgreSQL, MongoDB, and Oracle with experience handling large-scale data migrations and performance tuning. Focused on data integrity, high availability, and disaster recovery planning.",
  },
  {
    id: "systems-administrator",
    title: "Systems Administrator",
    text: "Reliable Systems Administrator experienced in managing Windows and Linux server environments, automating routine tasks, and ensuring system uptime. Skilled in Active Directory, VMware, and cloud platforms with a strong foundation in scripting and monitoring tools. Dedicated to maintaining secure, scalable, and efficient IT infrastructure.",
  },
  {
    id: "technical-writer",
    title: "Technical Writer",
    text: "Precise Technical Writer with a talent for translating complex technical concepts into clear, user-friendly documentation. Experienced in creating API docs, user guides, and knowledge base articles for software products. Proficient in Markdown, Confluence, and DITA with a focus on consistency, accuracy, and readability.",
  },
  {
    id: "scrum-master",
    title: "Scrum Master",
    text: "Certified Scrum Master with a passion for facilitating agile practices and removing blockers for high-performing teams. Experienced in sprint planning, retrospectives, and stakeholder communication with a track record of improving team velocity and delivery quality. Strong servant-leader mindset with deep knowledge of Scrum and Kanban frameworks.",
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    text: "Skilled Data Engineer with expertise in building and maintaining scalable data pipelines and ETL processes. Proficient in Apache Spark, Airflow, and cloud data warehousing solutions like Snowflake and BigQuery. Experienced in transforming raw data into structured datasets that power analytics and machine learning workflows.",
  },
  {
    id: "sre",
    title: "Site Reliability Engineer",
    text: "Results-driven Site Reliability Engineer with experience ensuring high availability and performance of large-scale distributed systems. Proficient in Kubernetes, Terraform, and observability tools like Prometheus and Grafana. Strong in incident response, capacity planning, and building automation that reduces toil and improves system resilience.",
  },
  {
    id: "blockchain-developer",
    title: "Blockchain Developer",
    text: "Innovative Blockchain Developer with expertise in smart contract development, decentralized application architecture, and cryptographic protocols. Proficient in Solidity, Rust, and Web3.js with hands-on experience building on Ethereum and Solana networks. Passionate about decentralized finance, tokenomics, and the future of trustless systems.",
  },
  {
    id: "iot-developer",
    title: "IoT Developer",
    text: "Creative IoT Developer experienced in designing and deploying connected device ecosystems using embedded systems and cloud platforms. Proficient in Arduino, Raspberry Pi, MQTT, and AWS IoT with a strong foundation in sensor integration and real-time data processing. Focused on building smart, efficient, and secure IoT solutions.",
  },
  {
    id: "ar-vr-developer",
    title: "AR/VR Developer",
    text: "Immersive AR/VR Developer with experience building interactive augmented and virtual reality applications for education, entertainment, and enterprise. Proficient in Unity, Unreal Engine, and C# with expertise in 3D modeling integration and spatial computing. Passionate about creating engaging experiences that push the boundaries of human-computer interaction.",
  },
  {
    id: "game-developer",
    title: "Game Developer",
    text: "Passionate Game Developer with experience creating engaging gameplay mechanics, physics systems, and interactive narratives. Proficient in Unity, C++, and Godot with a strong portfolio of indie and commercial projects. Skilled in optimizing game performance, implementing AI behavior, and collaborating with artists and designers to deliver polished titles.",
  },
  {
    id: "penetration-tester",
    title: "Penetration Tester",
    text: "Ethical Penetration Tester with expertise in identifying and exploiting security vulnerabilities across web applications, networks, and cloud environments. Proficient in Burp Suite, Metasploit, and Kali Linux with certifications like CEH and OSCP. Committed to helping organizations strengthen their security posture through thorough testing and actionable reporting.",
  },
  {
    id: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    text: "Data-driven Digital Marketing Specialist with expertise in paid advertising, email marketing, and conversion optimization. Experienced in managing campaigns across Google Ads, Meta Ads, and LinkedIn with a proven track record of increasing ROI and customer acquisition. Skilled in analytics, A/B testing, and marketing automation tools.",
  },
  {
    id: "seo-specialist",
    title: "SEO Specialist",
    text: "Strategic SEO Specialist with a deep understanding of search engine algorithms, keyword research, and on-page optimization. Experienced in technical SEO audits, link building strategies, and content optimization that drives organic traffic growth. Proficient in SEMrush, Ahrefs, and Google Analytics with a data-driven approach to ranking improvements.",
  },
  {
    id: "supply-chain-manager",
    title: "Supply Chain Manager",
    text: "Efficient Supply Chain Manager with experience optimizing procurement, logistics, and inventory management processes. Skilled in demand forecasting, vendor negotiation, and implementing supply chain automation solutions. Strong analytical skills with a track record of reducing costs and improving delivery timelines across global operations.",
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    text: "Organized Operations Manager with a proven ability to streamline processes, manage teams, and drive operational efficiency. Experienced in workflow optimization, budget management, and cross-departmental coordination. Strong leadership skills with a focus on continuous improvement and delivering measurable business results.",
  },
  {
    id: "qa-manager",
    title: "Quality Assurance Manager",
    text: "Thorough Quality Assurance Manager with expertise in building and leading QA teams, defining testing strategies, and ensuring product quality across software development lifecycles. Proficient in both manual and automated testing methodologies with experience implementing test frameworks and CI/CD quality gates. Committed to delivering defect-free products that meet user expectations.",
  },
  {
    id: "civil-engineer",
    title: "Civil Engineer",
    text: "Licensed Civil Engineer with experience in structural design, site development, and construction project management. Proficient in AutoCAD, STAAD Pro, and Revit with a strong foundation in geotechnical analysis and material science. Committed to delivering safe, sustainable, and cost-effective infrastructure solutions that meet regulatory standards.",
  },
  {
    id: "mechanical-engineer",
    title: "Mechanical Engineer",
    text: "Innovative Mechanical Engineer with expertise in product design, thermal analysis, and manufacturing processes. Proficient in SolidWorks, ANSYS, and MATLAB with hands-on experience in prototyping and CAD modeling. Strong problem-solving skills with a focus on designing efficient, reliable, and manufacturable mechanical systems.",
  },
];

export const SummaryStep: React.FC = () => {
  const summary = useResumeStore((state) => state.summary);
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const experiences = useResumeStore((state) => state.experiences);
  const skills = useResumeStore((state) => state.skills);
  const actions = useResumeStore((state) => state.actions);

  const [searchQuery, setSearchQuery] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return SUMMARY_TEMPLATES;
    const q = searchQuery.toLowerCase();
    return SUMMARY_TEMPLATES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.text.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleUseTemplate = (id: string, text: string) => {
    setSelectedTemplateId(id);
    actions.updateSummary(text);
  };

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/ai/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: "enhance",
          currentText: summary,
          context: {
            firstName: personalInfo.firstName,
            surname: personalInfo.surname,
            role: experiences.length > 0 ? experiences[0].role : "",
            company: experiences.length > 0 ? experiences[0].company : "",
            skills: skills.map((s) => s.name),
            experienceCount: experiences.length,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        actions.updateSummary(data.result);
      }
    } catch {
      // Graceful degradation — keep user's original text
    } finally {
      setDirty(false);
      setAiGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Write your professional summary"
        description="A 3–4 sentence overview of who you are and what you bring."
      />
      <motion.div variants={cardVariant} className={styles.formCard}>
        <div className={styles.summaryLayout}>
          {/* Left Panel: Templates */}
          <div className={styles.summaryLeftPanel}>
            <div className={styles.summarySearchWrap}>
              <span className={styles.summarySearchIcon}>
                <Search size={14} />
              </span>
              <input
                type="text"
                className={styles.summarySearchInput}
                placeholder="Search by Job Title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.templateList}>
              {filteredTemplates.map((template) => (
                <div key={template.id} className={`${styles.summaryTemplateCard} ${selectedTemplateId === template.id ? styles.summaryTemplateCardActive : ""}`}>
                  <div className={styles.summaryTemplateCardContent}>
                    <div className={styles.summaryTemplateCardTitle}>
                      <span>{template.title}</span>
                    </div>
                    <div className={styles.summaryTemplateCardPreview}>
                      {template.text}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.templateAddBtn}
                    onClick={() => handleUseTemplate(template.id, template.text)}
                    title={`Use ${template.title} template`}
                  >
                    {selectedTemplateId === template.id ? <Check size={14} /> : <Plus size={14} />}
                  </button>
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  No templates found
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Editor */}
          <div className={styles.summaryRightPanel}>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "5px", flex: 1, overflow: "hidden" }}>
              <div className="flex justify-between items-center" style={{ marginBottom: "1rem" }}>
                <label style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}>
                  Professional Summary
                  <span style={{
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    color: summary.length >= 480 ? (summary.length >= 500 ? "#ef4444" : "#f59e0b") : "var(--text-muted)",
                    marginLeft: "auto",
                  }}>
                    {summary.length}/500
                  </span>
                </label>
              </div>
              <textarea
                className={styles.summaryTextarea}
                value={summary}
                onChange={(e) => { actions.updateSummary(e.target.value); setDirty(true); }}
                onBlur={() => { if (dirty && summary.trim().length > 0) handleAiGenerate(); }}
                placeholder="Brief professional summary…"
                maxLength={500}
              />
              {/* Fixed-height warning area — always reserves space so button never shifts */}
              <div style={{ minHeight: "1.6rem", marginTop: "0.35rem" }}>
                {summary.length >= 480 && (
                  <span
                    style={{
                      color: summary.length >= 500 ? "#ef4444" : "#f59e0b",
                      fontSize: "0.8rem",
                      display: "block",
                    }}
                  >
                    {summary.length >= 500
                      ? "Character limit reached."
                      : `Only ${500 - summary.length} characters left.`}
                  </span>
                )}
              </div>
              <button
                type="button"
                className={styles.aiGenerateBtn}
                onClick={handleAiGenerate}
                disabled={aiGenerating || summary.trim().length === 0}
                style={{ alignSelf: "flex-end", marginTop: "-1rem" }}
              >
                {aiGenerating ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <WandSparkles size={13} />
                    {summary.trim().length === 0 ? "Enter summary first" : "Enhance with AI"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SummaryStep;
