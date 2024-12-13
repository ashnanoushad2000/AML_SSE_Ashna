# ADR 0002: Rejection of SQLite for Database Management

## Status
- Rejected

## Context
During the initial phase of selecting a database management system for the Advanced Media Library System, SQLite was considered as a potential option. SQLite is known for its lightweight nature and ease of configuration, which can be ideal for smaller applications or environments where simplicity and minimal setup are paramount.

## Decision
We decided against using SQLite for the following reasons:

- **Scalability**: SQLite is a file-based database that works well for applications with lighter database usage. However, it is not well-suited for high-volume transactions or concurrent access as expected in our media library system.
- **Performance**: For our project, which anticipates a substantial amount of reads and writes and may grow in user number, MySQL's performance and robust handling of concurrent operations are more advantageous.
- **Client-Server Model**: MySQL operates on a client-server model which is a requirement for our system, allowing remote access and management of the database; SQLite’s serverless architecture is less compatible with our needs for multi-user access and networked library management.
- **Feature Set**: MySQL offers a more extensive set of features, including more comprehensive security features, which are necessary for our project's scope and future scalability.
- **Lecturer’s Recommendation**: Additionally, our lecturer advised against using SQLite due to its limitations in handling larger, more complex databases effectively, which further influenced our decision to opt for MySQL.

## Consequences
- **Positive**:
  - Avoiding SQLite removes the risks associated with scaling issues as user base and transaction volume grow.
  - MySQL offers more robust support for complex queries and data integrity features which are essential for the comprehensive data management needs of a library system.
- **Negative**:
  - SQLite's simplicity and less resource-intensive setup could have accelerated initial development phases, but its limitations in handling complex operations and larger datasets would pose challenges as the project scales.

