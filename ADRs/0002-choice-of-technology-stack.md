# ADR 0002: Choice of Technology Stack

## Status
- Approved

## Context
The selection of Angular for the frontend development, MySQL for the database, and local hosting on development PCs was influenced by the following factors:

- **Angular**:
  - **Expertise and Support**: The development team has experience with Angular, and it was also recommended by the academic advisor, ensuring an efficient development process and reliable support.
  - **Comprehensive Framework**: Angular provides a robust framework with a wide range of features for building interactive and dynamic user interfaces, essential for the management features of the Advanced Media Library System.
  - **Community and Ecosystem**: Angular has a large community and a vast ecosystem of libraries and tools that can speed up development and offer ready-made solutions for common problems.

- **MySQL**:
  - **Reliability**: MySQL is known for its reliability and is widely used in the industry, making it a dependable choice for our database needs.
  - **Scalability**: It offers good scalability options, which is crucial for handling the potentially large and growing data needs of a media library system.
  - **Compatibility**: MySQL is compatible with all major hosting platforms, which aligns with our need for flexibility in deployment environments.

- **Local Hosting**:
  - **Development Flexibility**: Local hosting provides the development team with control over the environment, making it easier to manage changes and troubleshoot issues quickly.
  - **Cost-Effective**: It reduces initial costs as there is no need for investment in external hosting services during the development phase.
  - **Security**: Keeps sensitive data within the controlled environment, which is beneficial during the initial phases of development.

## Decision
We have decided to use Angular for the frontend, MySQL as our database system, and to host our development environment locally on our PCs. This decision aligns with our goals of using reliable, well-supported technology that matches our team’s skills and project requirements.

## Consequences
- **Positive**:
  - Angular will allow for rapid development of a responsive and feature-rich client interface.
  - MySQL will ensure that data management is efficient and scalable.
  - Local hosting will simplify initial setup and development, offering full control over the environment.

- **Negative**:
  - Dependency on local infrastructure may limit access and collaboration options for remote team members.
  - The use of MySQL may limit some advanced database functionalities available in other NoSQL databases, which could be explored in future phases.
  - Scaling from a local to a production environment will require careful planning to avoid deployment issues.