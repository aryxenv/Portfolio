---
id: "education-thomas-more-data-engineering"
title: "Data Engineering (YP0919)"
type: "about"
category: "education"
course_code: "YP0919"
ects: 6
grade: "14/20"
semester: "Y2Sem2"
folder_path: "OneDrive - Thomas More/Y2Sem2/DataEngineering"
source: "cv/tm_docs/transcript_of_records.pdf"
summary: "Enterprise data architecture and pipeline design, focusing on Data Vault 2.0 modeling (Hubs, Links, Satellites), relational data warehousing, and ETL/ELT pipelines using SQL and Python."
tags:
  - "data-engineering"
  - "data-vault"
  - "etl"
  - "data-warehousing"
  - "sql-pipelines"
  - "data-architecture"
  - "thomas-more"
---

# Data Engineering (YP0919)

## Course Overview & Academic Context

`Data Engineering` (Course Code: `YP0919`) is a mandatory course unit in the Bachelor of International Business Management (Data Science, Protection & Security) curriculum at Thomas More University of Applied Sciences, Mechelen Campus. 

- **Academic Period**: Completed during academic semester **`Y2Sem2`**.
- **Credit Weight**: **6 ECTS Credits**.
- **Official Examination Result**: **14/20** (Pass with credit obtained).
- **Academic Archive Location**: `OneDrive - Thomas More > Y2Sem2 > DataEngineering`.
- **Authoritative Source**: Confirmed in official Thomas More Transcript of Records (Code: `09C6AF65875C4383AC5A581FFEFEB9B0`).

Data Engineering explores the principles of enterprise data architecture, analytical data modeling, and robust data pipeline engineering, transitioning raw operational records into scalable analytical repositories.

## Core Curriculum & Theoretical Foundations

The theoretical curriculum contrasts traditional relational databases (3NF) and Inmon/Kimball dimensional models with Dan Linstedt's Data Vault 2.0 architecture. Core topics include Data Vault building blocks—Hubs (business keys), Links (business relationships/transactions), and Satellites (contextual attributes and historical change tracking)—alongside surrogate hash key generation, audit trails, and ETL vs. ELT pipeline architectures.

## Practical Lab Work & Hands-On Projects

Practical work included designing and implementing an enterprise Data Vault schema. Students completed the DVD Rental advanced data engineering project (`dvd-rental-advanced-project.md`, `dataEngineeringProject.ipynb`), modeling transactional retail operations into Hubs, Links, and Satellites, loading source data via Python and SQL transformation scripts, and verifying data auditability.

## Folder Structure & Studied Materials

The course materials, assignments, codebases, and student deliverables are systematically archived in the university cloud storage directory under `OneDrive - Thomas More/Y2Sem2/DataEngineering`. The preserved folder hierarchy includes:

- **`Week 1 - Week 2`**: Data engineering landscape, relational warehousing review, limitations of 3NF/Kimball, and Data Vault introduction.
- **`Week 2 - Week 3`**: Data Vault 2.0 core modeling: Hubs, Links, Satellites, hashing strategies (MD5/SHA-256), and load date stamps.
- **`Week 4 & DVD Rental Project`**: Building ETL/ELT transformation pipelines, ingesting relational datasets, and staging data into the raw vault.
- **`Exam & Project Submission`**: Data Vault architectural documentation, pipeline validation notebooks, and final project defense.

All code assets and technical reports reflect rigorous conceptual engineering, maintained without superfluous code dumps to preserve high-level semantic clarity.

## Key Competencies & Learning Outcomes

Ability to model scalable data warehouses using Data Vault 2.0 methodology, construct automated ETL pipelines, implement historical change tracking via Satellites, and maintain enterprise data lineage.
