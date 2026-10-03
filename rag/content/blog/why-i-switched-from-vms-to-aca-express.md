---
id: "blog-why-i-switched-from-vms-to-aca-express"
title: "Why I Switched from VMs to ACA Express"
type: "blog"
category: "Cloud Infrastructure & Cost Optimization"
tech_stack:
  - "Azure Container Apps (ACA Express)"
  - "Azure Virtual Machines"
  - "Docker"
  - "GitHub Container Registry (GHCR)"
  - "Azure User-Assigned Managed Identities"
  - "FastAPI"
  - "Astro"
tags:
  - "azure"
  - "virtual-machines"
  - "aca-express"
  - "cloud-computing"
  - "cost-optimization"
  - "github-container-registry"
  - "user-managed-identities"
  - "docker"
summary: "Cost optimization case study analyzing why Azure B1s Virtual Machines incurred ~€5.64/month in hidden disk and static IP fees, and how migrating portfolio backends and the NNUE chessbot to Azure Container Apps (ACA Express) with scale-to-zero, GHCR, and User-Assigned Managed Identities dropped hosting costs by 99% to €0.04/month."
source: "src/content/blog/why-i-switched-from-vms-to-aca-express/index.md"
---

# Why I Switched from VMs to ACA Express

## Context & The Free VM Fallacy

In the companion post *How I Deployed an AI Agent on My Portfolio Without Going Broke*, Azure Virtual Machines (specifically burstable `Standard_B1s` instances) were initially proposed as an economical compute hosting option under the Azure for Students benefit. The student subscription advertises 750 hours of free compute monthly for select VM types—theoretically covering an entire 730-hour month.

However, in practice, compute is only one component of a running VM:
- Even when compute hours are waived, mandatory ancillary cloud resources (static public IP addresses, managed OS disks, and disk I/O operations) continue billing round-the-clock.
- These fixed operational costs accrue regardless of whether the hosted applications receive active traffic.

## Empirical Cost Audit: 4.3 Days of Azure B1s VM

Between September 6 and September 10, 2026, Aryan Shah ran a single `Standard_B1s` VM in Azure's `swedencentral` region (configured with a standard static IPv4 public IP and a 32 GiB E4 Standard SSD OS disk) to host backend services before decommissioning it.

Over **4.3 days (~103.5 hours)** of runtime, the instance generated **€0.81** in fixed operational charges:

| Resource & Meter | Usage Volume | Incurred Cost | Cost Share |
| :--- | :--- | :--- | :--- |
| **Standard IPv4 Static Public IP** | 104 hours | €0.45 | 55.5% |
| **E4 Standard SSD Disk (32 GiB Storage)** | 4.3 days | €0.30 | 36.7% |
| **E4 Standard SSD Disk Operations** | ~367,000 IO transactions | €0.06 | 7.8% |
| **B1s Compute (1 vCPU, 1 GiB RAM)** | 103.3 hours (free tier) | €0.00 | 0.0% |
| **Data Transfer / Egress** | ~30 MB (free tier allowance) | €0.00 | 0.0% |
| **Total (4.3 Days)** | | **€0.81** | **100%** |

Extrapolated over a full month, this "free" compute configuration costs **~€5.64/month** (~€0.19/day):
- **€0.00 for Compute**: The 750-hour free tier entitlement applies as advertised.
- **€3.13/month for Static Public IPv4**: A mandatory requirement to receive inbound HTTP traffic from the public internet.
- **€2.06/month for Disk Capacity**: Azure's free tier does not waive Standard SSD provisioning fees (the default OS disk tier).
- **€0.45/month for Idle Disk I/O**: Baseline Linux system daemons and logging generate 50k–100k background read/write transactions daily even at zero user concurrency.

## Azure Container Apps (ACA Express): Mechanics of Near-Zero Cost

On September 10, 2026, the backend workloads were migrated to **Azure Container Apps (ACA Express)**. Over the remaining 20 days of September, total hosting expenses dropped to **€0.04** (~€0.002/day), representing a **99% cost reduction**:

- **No Static Public IP Fees**: ACA natively provides managed ingress, load balancing, and automated HTTPS certificate lifecycle management out of the box.
- **No Provisioned Disk Capacity Fees**: Stateless container workloads utilize ephemeral storage allocations rather than dedicated persistent disks.
- **Scale-to-Zero Architecture**: By setting `min-replicas = 0`, container replicas de-provision completely when idle, eliminating all idle compute burn.

### Hidden Account-Level Free Tier Allocation

ACA Express includes a generous, perpetually recurring free monthly quota per Azure subscription (independent of student credits):
- **180,000 vCPU-seconds** per month
- **360,000 GiB-seconds** of memory per month
- **2,000,000 HTTP requests** per month

Combined with rapid container provisioning where cold starts are near-instantaneous, this provides a zero-idle-cost runtime suitable for hosting multiple low-to-medium traffic personal services.

## Migration Architecture & Overcoming Platform Constraints

The migration encompassed two primary production workloads:
1. **Portfolio Backend**: Orchestrating agent interactions, session routing, and RAG retrieval pipelines.
2. **NNUE Chessbot Backend**: Serving neural network evaluation inference and interactive chess engine moves.

During migration, two platform limitations in ACA Express were identified and solved:

### Limitation 1: Managed Identities (User-Assigned vs. System-Assigned)

ACA Express does not support System-Assigned Managed Identities. To maintain Entra ID authentication without hardcoding service principals or credentials:
- Configured an **Azure User-Assigned Managed Identity**.
- Assigned role-based access control (RBAC) permissions to the managed identity, which ACA Express supports seamlessly with zero incremental cost.

### Limitation 2: Container Image Registry Strategy (GHCR vs. ACR)

Stateless ACA deployment requires packaged Docker container images:
- Traditional Azure Container Registry (ACR) instances incur fixed daily storage and runtime fees.
- To maintain zero infrastructure overhead, images are published to **GitHub Container Registry (`ghcr.io`)**, leveraging free public registry hosting (and generous free limits for private packages).

### CI/CD Pipeline & Ingress Cutover

1. **GitHub Actions Automation**: Replaced legacy SSH VM deployment workflows with a modern pipeline building multi-stage Dockerfiles and pushing versioned images to GHCR before triggering ACA revision updates.
2. **Frontend Endpoints**: Updated frontend API clients to route traffic from legacy VM IP endpoints to the managed ACA HTTPS URL.
3. **VM Teardown & Resource Deletion**: Decommissioned all legacy compute resources (VM instance, network security group, network interface, static IP address, and managed OS disk) to eliminate lingering daily meter charges.

## Financial Results & Summary Comparison

| Metric / Dimension | Azure Virtual Machine (B1s) | Azure Container Apps (ACA Express) | Improvement |
| :--- | :--- | :--- | :--- |
| **Monthly Fixed Hosting Cost** | ~€5.64 / month | ~€0.04 / month | **99% cost reduction** |
| **Idle Running Cost** | €0.19 / day | €0.00 / day (scales to zero) | **100% idle savings** |
| **Ingress & TLS Certificate** | Requires manual setup & static IP | Managed natively with automatic HTTPS | Simplified operations |
| **Compute Quota Independence** | Dependent on student subscription VM grants | Permanent account-level monthly free tier | Future-proof beyond student sub |

## References & Architectural Links

- [Why I Switched from VMs to ACA Express (Original Post)](file:///c:/Users/aryan/OneDrive/Portfolio/nodeDev/PortfolioDev/src/content/blog/why-i-switched-from-vms-to-aca-express/index.md)
- [How I Deployed an AI Agent on My Portfolio Without Going Broke](file:///c:/Users/aryan/OneDrive/Portfolio/nodeDev/PortfolioDev/src/content/blog/how-i-deployed-an-ai-agent-on-my-portfolio-without-going-broke/index.md)
- [Portfolio Live Deployment](https://aryxenv.dev/)
- [NNUE Chessbot Live Deployment](https://aryxenv.dev/nnue-chessbot/)
- [Azure Container Apps Pricing & Free Tier Limits](https://azure.microsoft.com/en-us/pricing/details/container-apps/)
- [Azure Virtual Machines Pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/)
- [GitHub Container Registry Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Azure User-Assigned Managed Identities](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)
