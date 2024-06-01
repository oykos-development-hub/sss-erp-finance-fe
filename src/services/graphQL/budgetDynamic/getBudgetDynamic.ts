const getBudgetDynamic = `query SpendingDynamicOverview($budget_id: Int, $unit_id: Int, $version: Int) {
  spendingDynamic_Overview(budget_id: $budget_id, unit_id: $unit_id, version: $version) {
    status
    message
    data
    items {
      ...SpendingDynamicFields
      children {
        ...SpendingDynamicFields
        children {
          ...SpendingDynamicFields
          children {
            ...SpendingDynamicFields
            children {
                ...SpendingDynamicFields
								children {
									...SpendingDynamicFields
								}
            }
          }
        }
      }
    }
  }
}

fragment SpendingDynamicFields on SpendingDynamicType {
  id
  budget_id
  unit_id
  account_id
  account_serial_number
  account_title
  current_budget_id
  actual
  username
  january {
    value
    savings
  }
  february {
    value
    savings
  }
  march {
    value
    savings
  }
  april {
    value
    savings
  }
  may {
    value
    savings
  }
  june {
    value
    savings
  }
  july {
    value
    savings
  }
  august {
    value
    savings
  }
  september {
    value
    savings
  }
  october {
    value
    savings
  }
  november {
    value
    savings
  }
  december {
    value
    savings
  }
  total_savings
  created_at
}`;

export default getBudgetDynamic;
