# UML Class Diagram

```mermaid
classDiagram
    class AffiliateAccount {
        +string id
        +string domain
        +string status
        +string stage
        +number traffic
        +string notes
        +Contact[] contacts
        +PlacementOpportunity[] placements
        +CommunicationEntry[] communicationHistory
        +Tag[] tags
        +AffiliateMetrics metrics
        +string createdAt
        +string updatedAt
        +updateStatus(status: string)
        +moveToStage(stage: string)
        +addContact(contact: Contact)
        +addPlacement(placement: PlacementOpportunity)
    }

    class AffiliateMetrics {
        +number conversionRate
        +number averageOrderValue
        +number monthlyTraffic
        +number engagementScore
        +updateMetrics(metrics: Object)
    }

    class Contact {
        +string id
        +string affiliateId
        +string firstName
        +string lastName
        +string email
        +string phone
        +string role
        +boolean isPrimary
        +string lastContactDate
        +CustomFieldValue[] customFields
        +string createdAt
        +string updatedAt
        +updateContactInfo(info: Object)
        +markAsPrimary()
    }

    class PlacementOpportunity {
        +string id
        +string affiliateId
        +string title
        +OpportunityType type
        +string url
        +number pricing
        +number audienceReach
        +OpportunityStatus status
        +CustomFieldValue[] customFields
        +Contract contract
        +string createdAt
        +string updatedAt
        +updateStatus(status: string)
        +generateContract()
    }

    class Contract {
        +string id
        +string placementId
        +string status
        +Date startDate
        +Date endDate
        +number value
        +string[] terms
        +sign()
        +terminate()
    }

    class CommunicationEntry {
        +string id
        +string type
        +string content
        +string date
        +string status
        +string userId
        +Attachment[] attachments
        +markAsRead()
        +addAttachment(attachment: Attachment)
    }

    class Tag {
        +string id
        +string name
        +string color
        +Date createdAt
    }

    class CustomField {
        +string id
        +string name
        +FieldType type
        +boolean required
        +number order
        +FieldSection section
        +string[] options
        +validate(value: any)
    }

    class CustomFieldValue {
        +string fieldId
        +string|number|Date value
        +validate()
    }

    class StorageService {
        +saveAffiliates(affiliates: AffiliateAccount[])
        +getAffiliates(): AffiliateAccount[]
        +addUploadRecord(record: UploadRecord)
        +getUploadHistory(): UploadRecord[]
        +clearAll()
        +backup()
        +restore(backupId: string)
    }

    class FieldService {
        +getFields(): Field[]
        +addField(field: Field)
        +updateField(field: Field)
        +deleteField(fieldId: string)
        +getAffiliateFields(): AffiliateField[]
        +getContactFields(): ContactField[]
        +getPlacementFields(): PlacementField[]
        +validateFieldValue(fieldId: string, value: any)
        +formatFieldValue(value: any, type: FieldType)
    }

    class CSVImportService {
        +importCSV(fileContent: string): Promise<ImportResult>
        -parseCSV(content: string): ParsedCSVData
        -validateData(data: ParsedCSVData): ValidationResult[]
        -transformToAffiliate(row: CSVRow): AffiliateAccount
    }

    class AffiliateService {
        +updateAffiliateStatus(affiliate: AffiliateAccount, status: string)
        +getAffiliatesByStage(stage: string): AffiliateAccount[]
        +getAffiliatesByStatus(status: string): AffiliateAccount[]
    }

    AffiliateAccount "1" *-- "many" Contact
    AffiliateAccount "1" *-- "many" PlacementOpportunity
    AffiliateAccount "1" *-- "many" CommunicationEntry
    AffiliateAccount "1" *-- "many" Tag
    AffiliateAccount "1" *-- "1" AffiliateMetrics
    Contact "1" *-- "many" CustomFieldValue
    PlacementOpportunity "1" *-- "many" CustomFieldValue
    PlacementOpportunity "1" *-- "1" Contract
    CustomFieldValue "many" --* "1" CustomField
    StorageService -- AffiliateAccount : manages
    FieldService -- CustomField : manages
    CommunicationEntry "1" *-- "many" Attachment
    CSVImportService -- AffiliateAccount : imports
    AffiliateService -- AffiliateAccount : manages

```

## Component Relationships

```mermaid
classDiagram
    class Companies {
        -AffiliateAccount[] affiliates
        -handleUpdateAffiliate()
        -handleBulkUpdate()
        -handleDeleteAffiliates()
        -handleStageChange()
        -handleStatusChange()
    }

    class AffiliateList {
        -AffiliateAccount[] affiliates
        -handleSort()
        -handleStageChange()
        -handleStatusChange()
        -handleSelectRows()
    }

    class AffiliateDetails {
        -AffiliateAccount affiliate
        -addCommunicationEntry()
        -updateAffiliateStatus()
        -handleAddContact()
        -handleAddPlacement()
    }

    class ContactModal {
        -Contact contact
        -onSave()
        -onClose()
        -validateForm()
    }

    class PipelineStages {
        -stageCounts
        -handleStageClick()
        -calculateMetrics()
    }

    class BulkActions {
        -selectedIds: string[]
        -handleStageChange()
        -handleDelete()
        -handleConfirm()
    }

    class CSVUpload {
        -handleFileUpload()
        -validateFile()
        -processImport()
    }

    class FieldsManager {
        -fields: Field[]
        -handleAddField()
        -handleUpdateField()
        -handleDeleteField()
    }

    Companies "1" *-- "1" AffiliateList
    Companies "1" *-- "0..1" AffiliateDetails
    Companies "1" *-- "1" PipelineStages
    Companies "1" *-- "0..1" BulkActions
    Companies "1" *-- "0..1" CSVUpload
    AffiliateDetails "1" *-- "0..1" ContactModal
    Companies "1" *-- "1" FieldsManager
```

This UML diagram shows:

1. Data Models:
   - Core entities like AffiliateAccount, Contact, PlacementOpportunity
   - Supporting types like CommunicationEntry, Tag, and CustomField
   - Relationships between entities
   - Updated field types and method signatures

2. Services:
   - StorageService for data persistence
   - FieldService for custom field management
   - CSVImportService for handling CSV imports
   - AffiliateService for affiliate management

3. Component Hierarchy:
   - Main Companies component
   - Child components like AffiliateList and AffiliateDetails
   - Modal components like ContactModal
   - New components like BulkActions and FieldsManager

4. Key relationships and cardinality between components and entities

5. Updated method signatures and properties to match current implementation