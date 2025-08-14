import { getRule } from '@utils/api'
import { createRule, updateRule } from '@components/form/actions'
import FormWrapper from '@components/form/wrapper'
import { RuleFormInputs } from '@components/form/inputs'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string, id?: string[] }> }) {
    const { id, slug } = await params

    if (id) {
        const rule = await getRule(Number(id[0]))
        if (typeof rule === 'object' && Object.keys(rule).length > 0) {
            if(slug === 'create') {
                return (
                    <FormWrapper name='rule' type='create' formAction={createRule}>
                        <RuleFormInputs />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper name='rule' type='update' formAction={updateRule}>
                        <RuleFormInputs />
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