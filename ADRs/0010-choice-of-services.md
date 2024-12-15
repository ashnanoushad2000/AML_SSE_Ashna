# ADR 0010: Choice of Services

## Status
- **Proposed**

## Context
The Advanced Media Library system requires a modular and scalable architecture to handle the complex operations of a digital library efficiently. Based on the system requirements and use cases, the decision to adopt a service-oriented architecture (SOA) is critical to ensure separation of concerns, ease of maintenance, and scalability.

To achieve this, it is proposed to organize the system into five distinct services, each responsible for handling a specific domain of library operations. This choice aligns with the principles of microservices architecture, enabling independent development, deployment, and scaling of individual services.

**Proposed Services**:
1. **Authentication Service**:
   - Handles user authentication and authorization processes.
   - Manages token-based access using JWT.
2. **Inventory Service**:
   - Manages library inventory, including stock updates and branch transfers.
   - Provides APIs for branch-specific inventory operations.
3. **Media Service**:
   - Manages media catalog, including search operations and media metadata.
   - Allows efficient discovery of library resources.
4. **Loan Service**:
   - Oversees loan management and hold operations.
   - Tracks borrowed items, due dates, and availability.
5. **Payment Service**:
   - Manages payment processing for fines, fees, and subscriptions.
   - Handles multiple payment methods and integrates fine calculations.

## Decision
The proposed architecture will organize the Advanced Media Library into the five services outlined above. Each service will:
- Operate independently and communicate with other services via APIs.
- Maintain its own database tables or schemas for domain-specific data (managed in a central database).
- Be developed using Python for backend logic and Flask for API endpoints.

The **API Gateway** will serve as the single entry point for routing and authenticating requests between the client and these services, simplifying client-side interactions.

## Consequences
- **Positive**:
  - Ensures separation of concerns, making it easier to maintain and scale individual services.
  - Improves fault isolation; issues in one service are less likely to affect others.
  - Facilitates parallel development by allowing teams to work on different services simultaneously.
  - Aligns with future scalability goals by enabling independent scaling based on service load.

- **Negative**:
  - Introduces communication overhead between services, increasing latency slightly.
  - Requires additional effort to manage service dependencies and orchestration.
  - Necessitates comprehensive logging and monitoring across multiple services for debugging and maintenance.