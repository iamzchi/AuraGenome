Dear Editors,

We are deeply grateful for your thoughtful and constructive feedback on our manuscript submitted to the CGA Special Issue on BioVis. Your insightful and detailed comments have been invaluable in refining the clarity, rigor, and overall quality of our work.

To address the reviewers’ feedback, we have carefully revised the manuscript, organizing our responses into eight key categories. Below, we detail the specific changes made in response to each point, ensuring alignment with your expectations. We believe these revisions significantly enhance the manuscript’s clarity, scientific rigor, and contribution to the field.

We greatly appreciate the opportunity to improve our work through this process and welcome any additional feedback on the revised submission. Thank you for your time and consideration.

Sincerely,

[Your Name and Co-Authors]

---

### 1. Clarity and Novelty (R1)

### Reviewer 1

> My biggest issue with the submission is the requirement analysis section. This section suggests that 42 genomics papers were analyzed. However, it is unclear what the purpose of the analysis, how this analysis was done, what methodology was followed, and what the outcome of the analysis. In addition, the section simply mentions 8 experts. No information is provided about their expertise, background, why they were involved, or at what capacity. It also does not disclose what/how they contributed to the identification of requirements (R1-R6). Later, in the Case Study section on Page 10, it is briefly mentioned that the system requirements were originally derived by co-designing with experts, which leads to more questions around the co-design protocol, if any apparatus/prototype was used, and how the input from experts impacted the design and requirements. With this lack of details, it becomes extremely challenging for the readers to validate R1-R6, which is critically important to substantiate, as the rest of the manuscript heavily depends on them.
> 
> 
> A minor gripe with the requirement analysis is the lack of clarity in how these requirements are novel from any other analytics tasks that follow natural language-based analysis. This is important because the workflow is designed to match these requirements. And considering the lack of clear novelty, the description of the automated workflow leads to questions around novelty as well, which is heavily claimed throughout the manuscript as a core contribution. It is unimportant to tease apart the novelty or unique requirements for circular genome visualizations compared to creating charts with natural language prompts in many other use cases/domains.
> 
> Continuing on with the concerns around novelty, the sequence log view is also claimed to be a novel visualization node-link-based visualization. While the ability to interact with past snapshots and reuse/upgrade them is well-demonstrated and appreciated, it is unclear how the ideas presented here differ from traditional interactive timeline visualizations. These concerns collectively lead to questions around claims made throughout the manuscript.
> 

---

### 2. Description of AuraGenome System Components (R1)

### Reviewer 1

> While the description of the workflow is well-executed, the description of the AuraGenome Visual Analytics System lacks key information. The major components are mentioned as a numbered list with little description, and only the central, parameter, and log views are expanded with details (Figure 4-e and f). The rest of the components are not referenced from the text, nor explained in the caption, which leads to open-ended interpretations and makes this section difficult to read and follow.
> 

---

### 3. Depth of Thematic Analysis and Discussion (R1)

### Reviewer 1

> While I appreciate the case study and user study description, I would much prefer to see a more in-depth discussion around the themes and thematic analysis, which are now represented with only a couple of quotes from participants each. This section could be further improved by adding details around the thematic analysis process, coding, and more robust discussions around the findings, especially given that the areas for improvement might suggest that the interface was too strict and limited in terms of interactions around annotations, making edits, and agency.
> 
> 
> In addition, the discussion somewhat reiterates the findings and does not expand further. I did enjoy reading the limitations and would love to see more nuanced discussions around the capability of LLMs to address complex requests, from visualizing circular genomes and the end-user expertise and exposure to natural language interfaces and their potential effect on task performance.
> 

---

### 4. Motivation for Using LLMs and System Interactions (R2)

### Reviewer 2

> W1: The core motivation of the work is that a static system for visualization of genomic data, like those referenced in the related work, is not flexible enough and so better interactions are necessary. However, the manuscript does not make it clear enough what types of interactions the users might want to make, and why an LLM would be the right tool for this, rather than a simple control panel.
> 
> 
> W4: While the figures are clear and the design is well described, it is a little hard to follow how the interactions with the system would work. A short video demonstrating usage would really help.
> 

---

### 5. Sharing of Prompt Benchmark Database (R2)

### Reviewer 2

> In addition, while it is not a weakness, it would be beneficial to the community if the prompt benchmark database (and expert feedback) that were used to select the LLMs were shared as supplemental material.
> 

---

### 6. Alternative Solutions, Agent Design, and Weaknesses (R3)

### Reviewer 3

> This manuscript describes a solid contribution in the field of visualization and use of LLMs. I would have liked to see more discussions on alternative solutions and more motivations for the actual design of the agents and their interactions. How did you arrive at the actual design? This is not well described. Perhaps an account for the implementation choices could be included in the supplemental material together with the prompts.
> 
> 
> The weaknesses of the manuscript are:
> 
> a) The dependence on foundational models with limited knowledge of training stacks.
> 
> b) Lacking exploration and discussion of alternative approaches.
> 
> c) The focus on circular plots, which may not be optimal for all cases.
> 

---

### 7. Missing References (R3)

### Reviewer 3

> This recent evaluation of the use of circular plots in genome visualization should be referenced:
> 
> 
> **Should I make it round? Suitability of circular and linear layouts for comparative tasks with matrix and connective data**, E Ståhlbom, J Molin, A Ynnerman, C Lundström
> 
> **Computer Graphics Forum** 43 (3), e15102, 2024
> 
> Important references are missing; more references are needed.
> 

---

### 8. Grammatical and Presentation Issues (R1, R2)

### Reviewer 1

> Page 1, line 24: “... leading time consuming, error prone, and high learning-cost” Seems like a broken sentence with terms missing.
> 
> 
> Page 3, line 30: “In addition, eight genomic experts (...)” seems to be an incomplete sentence.
> 
> Page 8, line 56: “After each step, the track remains fully interaction”, should be interactive.
> 
> Page 9, line 48: “The visual design depicts in Figure 5.” Seems to be a broken sentence.
> 
> Figure texts in 4, 7, and 8 are too small to read.
> 
> Figure captions could be more descriptive.
> 
> Inline subsection and subsubsection titles are not followed up with periods(.), which reduces readability.
> 
> Page 11: Study Design and Implementation participants reference subscripts are broken, with the second digit not rendered as subscripts. Later on PX is used to refer to participants without subscripts.
> 

### Reviewer 2

> W2: There are some grammatical mistakes in the paper, in particular in the abstract, but at other points in the paper, there are noticeable sentence fragments.
> 
> 
> W3: The keywords are incorrect. They mention Haptics and Assistive Technology, which are not a focus of this work. In addition, the abstract is not appropriate for publication because it has several grammatical mistakes, i.e. run on sentences or sentence fragments.
> 

---

### Authors’ Response

We are deeply grateful for the thoughtful and detailed feedback provided by the reviewers, which has significantly guided our efforts to refine and strengthen the manuscript. Below, we detail the revisions made to address each of the eight categories of comments, ensuring clarity, rigor, and alignment with the reviewers’ recommendations.

**1. Clarity and Novelty in Requirement Analysis (R1)**

To enhance the requirement analysis section, we added a detailed subsection outlining the methodology for analyzing 42 genomics papers, specifying the purpose (identifying visualization challenges), systematic review process, and outcomes (e.g., interactivity gaps). We clarified the 8 experts’ backgrounds (bioinformaticians, visualization researchers) and their roles in semi-structured interviews and co-design workshops, detailing the co-design protocol with low-fidelity prototypes and iterative feedback. To address novelty concerns, we now compare our requirements to general natural language analytics tasks, emphasizing domain-specific genomic challenges (e.g., complex data structures). The sequence log view’s distinction from traditional timeline visualizations is clarified by highlighting its dynamic snapshot reuse and upgrading tailored to genomic workflows, with tempered claims supported by specific evidence.

**2. Description of AuraGenome System Components (R1)**

We expanded the description of the AuraGenome Visual Analytics System by providing detailed explanations of all components, beyond the central, parameter, and log views. Each component is now referenced in the text, supported by updated captions in Figure 4, and a new figure illustrates component interactions, improving clarity and readability.

**3. Depth of Thematic Analysis and Discussion (R1)**

The case study and user study sections now include a detailed thematic analysis process, with coding details, additional participant quotes, and a new subsection addressing interface limitations (e.g., restrictive annotation and editing interactions). The discussion section has been expanded to explore LLMs’ capabilities in handling complex genomic visualization requests, considering end-user expertise and natural language interface familiarity. The limitations section now discusses scaling challenges, potential biases in natural language interactions, and strategies for improvement.

**4. Motivation for Using LLMs and System Interactions (R2)**

We added a subsection in the introduction outlining desired user interactions (e.g., dynamic visualization customization, iterative refinements via natural language) and why LLMs are superior to control panels, emphasizing their ability to interpret complex, context-sensitive prompts for bioinformaticians without programming expertise. To clarify system interactions, we included a supplemental video demonstrating AuraGenome’s usage (e.g., natural language input, visualization updates, log view navigation), referenced in the system description section and submitted as supplemental material.

**5. Sharing of Prompt Benchmark Database (R2)**

The prompt benchmark database and anonymized expert feedback used for LLM selection are now included as supplemental material. A brief description of the database’s structure and its role in the study is added to the methodology section, benefiting the community as suggested.

**6. Alternative Solutions, Agent Design, and Weaknesses (R3)**

A new methodology subsection details the multi-agent framework’s design process, including agent roles, rationale, and iterative design based on expert feedback. It compares alternatives (e.g., rule-based systems, single-agent LLMs), explaining the chosen framework’s scalability and adaptability. Implementation choices, including prompt engineering, are documented in supplemental material. We address weaknesses by discussing risks of foundational model dependency (e.g., limited training stack transparency) with mitigation strategies (e.g., model updates), exploring alternative visualization approaches, and justifying the focus on circular plots for specific genomic use cases (e.g., plasmids) while acknowledging linear layouts for other scenarios.

**7. Missing References (R3)**

We added the recommended reference by Ståhlbom et al. (2024) to the related work section, discussing its relevance to circular layouts in genomic visualization. Two additional recent references were included to strengthen the literature review, ensuring compliance with CG&A’s reference limit of 20.

**8. Grammatical and Presentation Issues (R1, R2)**

We conducted a thorough revision to address all grammatical and presentation concerns. Specific corrections include:

- Revised sentences flagged by Reviewer 1, such as “After each step, the track remains fully interaction” to “After each step, the track remains fully interactive” (Page 8, line 56), and completed incomplete sentences (e.g., Page 3, line 30: “In addition, eight genomic experts…” now fully specifies their role).
- Rewrote the abstract to eliminate sentence fragments and run-on sentences (Reviewer 2), ensuring clarity and publication readiness.
- Updated keywords to remove irrelevant terms (e.g., Haptics, Assistive Technology) and reflect the manuscript’s focus (e.g., circular genome visualization, multi-agent systems, LLMs).
- Enlarged figure texts in Figures 4, 7, and 8 for readability and expanded captions for greater descriptiveness.
- Added periods to inline subsection and subsubsection titles and corrected participant reference subscripts on Page 11 for consistency.
- Performed a comprehensive proofread to eliminate other grammatical errors, enhancing overall readability.

---

---