import RuleFields from '../client/ruleFields'

export default function RuleForm({ defaultValues }: { defaultValues?: GetRuleProps }) {
    return <RuleFields
        defaultValues={defaultValues}
    />
}
