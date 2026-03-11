# Tables

## portfolio_entries (D1)

| Column | Type | Description |
| - | - | --- |
| id | TEXT | Document id within each type |
| type | TEXT | Data group (`teaser`, `contact`, `project`, `certification`, `contribution`, `education`, `activity`) |
| payload | TEXT | JSON payload for each item |
| sort_order | INTEGER | Sort order within a type |
| created_at | TEXT | Created timestamp (UTC ISO-like string) |
| updated_at | TEXT | Updated timestamp (UTC ISO-like string) |

# Types

## Item

### Icons

| Code | Description |
| - | --- |
| 0 | Material Icons |
| 1 | Image from Internal Source |
| 2 | Image from External Source |

### Documentations

| Code | Description |
| - | --- |
| 1 | Documentations from Internal Source |
| 2 | Documentations from External Source |

### Projects

| Code | Description |
| - | --- |
| 0 | Previous Personal Projects |
| 1 | Ongoing Personal Projects |
| 2 | Previous open-source contributions |
| 3 | Ongoing open-source contributions |
| 4 | Previous presentations |
| 10 | Team Projects at a contest/award |
| 11 | Team Projects at Educational Institute |
| 12 | Team Projects at Hobby / Clubs |

### Education

| Code | Description |
| - | --- |
| 0 | Certificates |
| 1 | Test / Exam |
| 2 | Academic Contest / Laboratory Activities |
| 10 | Diploma or undergoing acts at Schools and other educational institutions (defined by law) |
| 11 | Micro-degrees or education courses at Schools and other educational institutions (defined by law) |
| 12 | Education Program, Courses from other sources |

### Organization

| Code | Descrition |
| - | --- |
| 0 | Host(주최) |
| 1 | Organizer(주관) |
| 2 | Sponsor(후원) |

## Fediverse Related

### Reactions at Post

| Code | Descrition |
| - | --- |
| 0 | Favorites |
| 1 | Boosts |
| 2 | Sponsor(후원) |
