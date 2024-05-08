package users

import data.utils
import data.organizations

# input: {
#     "scope": <"list"|"view"|"delete"|"update"> or null,
#     "auth": {
#         "user": {
#             "id": <num>,
#             "privilege": <"admin"|"business"|"user"|"worker"> or null
#         },
#         "organization": {
#             "id": <num>,
#             "owner": {
#                 "id": <num>
#             },
#             "user": {
#                 "role": <"owner"|"maintainer"|"supervisor"|"worker"> or null
#             }
#         } or null,
#     },
#     "resource": {
#         "id": <num>,
#         "membership": {
#             "role": <"owner"|"maintainer"|"supervisor"|"worker"> or null
#         }
#     } or null,
# }

# Default Allow Rule
default allow := false

# Admin Access
allow {
    utils.is_admin
}

# List Scope Access for Sandbox Users
allow {
    input.scope == utils.LIST
    utils.is_sandbox
}

# List Scope Access for Organization Members
allow {
    input.scope == utils.LIST
    organizations.is_member
}

# Filtering Entries (Django Q Object)
filter := [] {
    utils.is_admin
    utils.is_sandbox
} else := qobject {
    utils.is_sandbox
    qobject := [{"id": input.auth.user.id}]
} else := qobject {
    org_id := input.auth.organization.id
    qobject := [{"memberships__organization": org_id}]
}

# View Scope Access for User's Own Resource
allow {
    input.scope == utils.VIEW
    input.resource.id == input.auth.user.id
}

# View Scope Access for Resource Membership Role
allow {
    input.scope == utils.VIEW
    input.resource.membership.role != null
}

# Update/Delete Scope Access for User's Own Resource
allow {
    { utils.UPDATE, utils.DELETE }[input.scope]
    input.auth.user.id == input.resource.id
}

# Free Plan Features
allow {
    input.scope == utils.LIST
    not utils.is_sandbox
    not organizations.is_member
}

# Free Plan Limits
allow {
    input.scope == utils.LIST
    input.resource.id == input.auth.user.id
    input.resource.membership.role == "owner"
    input.resource.projects <= 3
    input.resource.tasks <= 10
    input.resource.tasks_in_project <= 5
    input.resource.webhooks <= 10
}

# Additional Free Plan Features (Assuming Unrestricted Limits)
allow {
    input.scope == utils.LIST
    input.resource.id == input.auth.user.id
    input.resource.auto_annotation == true
    input.resource.cloud_storages <= 1
    input.resource.ai_calls_in_job <= 100
    input.resource.export_annotations_job == true
    input.resource.export_annotations_project == true
    input.resource.export_annotations_task == true
}

# Note: The "x" features are not available in the free plan.

# Subscriber (Subscription) Plan Features (Assuming Unrestricted Limits)
allow {
    input.scope == utils.LIST
    input.resource.id == input.auth.user.id
    input.resource.auto_annotation == true
    input.resource.cloud_storages == "∞"
    input.resource.ai_calls_in_job == "∞"
    input.resource.export_annotations_job == true
    input.resource.export_annotations_project == true
    input.resource.export_annotations_task == true
    input.resource.projects == "∞"
    input.resource.tasks == "∞"
    input.resource.tasks_in_project == "∞"
    input.resource.webhooks == "∞"
}

