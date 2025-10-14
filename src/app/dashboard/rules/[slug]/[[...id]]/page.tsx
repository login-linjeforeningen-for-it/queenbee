import { getRule } from '@utils/api'
import { createRule, updateRule } from '@components/form/actions/rules'
import FormWrapper from '@components/form/wrapper'
import { notFound } from 'next/navigation'
import RuleFormInputs from '@components/form/server/rules'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string; id?: string[] }>
}) {
    const { id, slug } = await params

    if (id) {
        const rule = await getRule(Number(id[0]))
        if (typeof rule === 'object' && Object.keys(rule).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='rule'
                        type='create'
                        formAction={createRule}
                    >
                        <RuleFormInputs defaultValues={rule} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='rule'
                        type='update'
                        id={id[0]}
                        formAction={updateRule}
                    >
                        <RuleFormInputs defaultValues={rule} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper name='rule' type='create' formAction={createRule}>
                <RuleFormInputs />
            </FormWrapper>
        )
    }

    notFound()
}
