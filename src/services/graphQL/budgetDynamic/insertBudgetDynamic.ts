const insertBudgetDynamic = ` mutation($budget_id: Int, $unit_id: Int, $data: [SpendingDynamicMutation]) {
    spendingDynamic_Insert(budget_id: $budget_id, unit_id: $unit_id, data: $data) {
        status 
        message 
        data
        items {
          id
					budget_id
					unit_id
					account_id
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
					created_at
        }
    }
} `;

export default insertBudgetDynamic;
