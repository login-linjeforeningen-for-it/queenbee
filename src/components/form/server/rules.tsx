import RuleFormInputsClient from '../client/rules'

export default function RuleFormInputs({ defaultValues }: { defaultValues?: GetRuleProps }) {
    return <RuleFormInputsClient
        defaultValues={defaultValues}
    />
}
