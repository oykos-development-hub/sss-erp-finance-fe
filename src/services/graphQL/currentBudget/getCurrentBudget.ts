const getCurrentBudget = `query currentBudget_Overview($organization_unit_id: Int!) {
    currentBudget_Overview(organization_unit_id: $organization_unit_id) {
    status
    message
    items {
      units {
        id,
        title
      }
      budget_id
      version
      current_accounts {
        id
        parent_id
        title
        serial_number
        filled_data {
          budget_id
          actual
          current_amount
          balance
          initial_actual
        }
        children {
          id
          parent_id
          title
          serial_number
          filled_data {
            budget_id
            actual
            current_amount
            balance
            initial_actual
          }
          children {
            id
            parent_id
            title
            serial_number
            filled_data {
              budget_id
              actual
              current_amount
              balance
              initial_actual
            }
          }
          children {
            id
            parent_id
            title
            serial_number
            filled_data {
              budget_id
              actual
              current_amount
              balance
              initial_actual
            }
            children {
              id
              parent_id
              title
              serial_number
              filled_data {
                budget_id
                actual
                current_amount
                balance
                initial_actual
              }
              children {
                id
                parent_id
                title
                serial_number
                filled_data {
                  budget_id
                  actual
                  current_amount
                  balance
                  initial_actual
                }
                children {
                  id
                  parent_id
                  title
                  serial_number
                  filled_data {
                    budget_id
                    actual
                    current_amount
                    balance
                    initial_actual
                  }
                }
              }
            }
          }
        }
      }

      donation_accounts {
        id
        parent_id
        title
        serial_number
        filled_data {
          budget_id
          actual
          current_amount
          balance
          initial_actual
        }
        children {
          id
          parent_id
          title
          serial_number
          filled_data {
            budget_id
            actual
            current_amount
            balance
            initial_actual
          }
          children {
            id
            parent_id
            title
            serial_number
            filled_data {
              budget_id
              actual
              current_amount
              balance
              initial_actual
            }
          }
          children {
            id
            parent_id
            title
            serial_number
            filled_data {
              budget_id
              actual
              current_amount
              balance
              initial_actual
            }
            children {
              id
              parent_id
              title
              serial_number
              filled_data {
                budget_id
                actual
                current_amount
                balance
                initial_actual
              }
              children {
                id
                parent_id
                title
                serial_number
                filled_data {
                  budget_id
                  actual
                  current_amount
                  balance
                  initial_actual
                }
                children {
                  id
                  parent_id
                  title
                  serial_number
                  filled_data {
                    budget_id
                    actual
                    current_amount
                    balance
                    initial_actual
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
            `;

export default getCurrentBudget;
