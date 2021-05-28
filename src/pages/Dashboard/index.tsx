import React, { useState, useMemo, useCallback } from 'react'


import ContentHeader from '../../components/ContentHeader'
import SelectInput from '../../components/SelectInput'
import WalletBox from '../../components/WalletBox'
import MessageBox from '../../components/MessageBox'
import PieChartBox from '../../components/PieChartBox'
import HistoryBox from '../../components/HistoryBox'
import BarChartBox from '../../components/BarChartBox'

import expenses from '../../repositories/expenses'
import gains from '../../repositories/gains'
import listOfMonths from '../../utils/months'

import happyImg from '../../assets/happy.svg'
import sadImg from '../../assets/sad.svg'
import grinningImg from '../../assets/grinning.svg'

import {
  Container,
  Content
} from './styles'


const Dashboard: React.FC = () => {

  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1)
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear())


  const months = useMemo(() => {
    return listOfMonths.map((month, index) => {
      return {
        value: index + 1,
        label: month
      }
    })
  }, [])


  const years = useMemo(() => {
    let uniqueYears: number[] = []

    let allArray = [...expenses, ...gains]

    allArray.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()

      if (!uniqueYears.includes(year))
        uniqueYears.push(year)
    })

    return uniqueYears.map(year => {
      return {
        value: year,
        label: year
      }
    })

  }, [])


  const totalExpenses = useMemo(() => {
    let total: number = 0

    expenses.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if (month === monthSelected && year === yearSelected) {
        try {
          total += Number(item.amount)
        }
        catch {
          throw new Error('Invalid amount! Amount mos be number.')
        }
      }
    })

    return total

  }, [yearSelected, monthSelected])


  const totalGains = useMemo(() => {
    let total: number = 0

    gains.forEach(item => {
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if (month === monthSelected && year === yearSelected) {
        try {
          total += Number(item.amount)
        }
        catch {
          throw new Error('Invalid amount! Amount mos be number.')
        }
      }
    })

    return total

  }, [yearSelected, monthSelected])


  const totalBallance = useMemo(() => {
    return totalGains - totalExpenses
  }, [totalGains, totalExpenses])

  const message = useMemo(() => {

    if (!totalGains && !totalExpenses)
      return {
        title: 'Ainda não chegamos por aqui!',
        description: 'Você ainda não possui lançamentos para este mês!',
        footerText: 'Em breve, seus lançamentos estarão listados.',
        icon: happyImg
      }

    if (totalBallance < 0)
      return {
        title: 'Que triste!',
        description: 'Neste mês, você gastou mais do que deveria!',
        footerText: 'Corte gastos desnecessários ou crie novas fontes de renda para complementar seu orçamento.',
        icon: sadImg
      }

    if (totalBallance <= 0.99)
      return {
        title: 'Ufa!',
        description: 'Neste mês, você gastou o mesmo tanto que ganhou!',
        footerText: 'Considere planejar melhor seu orçamento, para evitar apertos.',
        icon: grinningImg
      }

    return {
      title: 'Muito bem!',
      description: 'Sua carteira está positiva!',
      footerText: ' Continue assim. Considere investir seu saldo.',
      icon: happyImg
    }
  }, [totalBallance, totalGains, totalExpenses])


  const relationOfBallance = useMemo(() => {
    const total = totalGains + totalExpenses

    const percentGains = Number(((totalGains / total) * 100).toFixed(1))
    const percentExpenses = Number(((totalExpenses / total) * 100).toFixed(1))


    const data = [
      {
        name: 'Entradas',
        value: totalGains,
        percent: percentGains ? percentGains : 0,
        color: '#F7931B'
      },
      {
        name: 'Saídas',
        value: totalExpenses,
        percent: percentExpenses ? percentExpenses : 0,
        color: '#E44C4E'
      }
    ]

    return data

  }, [totalGains, totalExpenses])


  const relationOfExpenses = useMemo(() => {
    let amountRecurrent = 0
    let amountEventual = 0

    expenses.filter(expense => {
      const date = new Date(expense.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      return month === monthSelected && year === yearSelected
    })
      .forEach(expense => {
        if (expense.frequency === 'recorrente')
          return amountRecurrent += Number(expense.amount)

        if (expense.frequency === 'eventual')
          return amountEventual += Number(expense.amount)

      })

    const total = amountRecurrent + amountEventual

    const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1))
    const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1))

    return [
      {
        name: 'Recorrente',
        amount: amountRecurrent,
        percent: recurrentPercent ? recurrentPercent : 0,
        color: '#F7931B'
      },
      {
        name: 'Eventual',
        amount: amountEventual,
        percent: eventualPercent ? recurrentPercent : 0,
        color: '#E44C4E'
      }
    ]
  }, [monthSelected, yearSelected])


  const relationOfGains = useMemo(() => {
    let amountRecurrent = 0
    let amountEventual = 0

    gains.filter(gain => {
      const date = new Date(gain.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      return month === monthSelected && year === yearSelected
    })
      .forEach(gain => {
        if (gain.frequency === 'recorrente')
          return amountRecurrent += Number(gain.amount)

        if (gain.frequency === 'eventual')
          return amountEventual += Number(gain.amount)

      })

    const total = amountRecurrent + amountEventual

    const recurrentPercent = Number(((amountRecurrent / total) * 100).toFixed(1))
    const eventualPercent = Number(((amountEventual / total) * 100).toFixed(1))

    return [
      {
        name: 'Recorrente',
        amount: amountRecurrent,
        percent: recurrentPercent ? recurrentPercent : 0,
        color: '#F7931B'
      },
      {
        name: 'Eventual',
        amount: amountEventual,
        percent: eventualPercent ? eventualPercent : 0,
        color: '#E44C4E'
      }
    ]
  }, [monthSelected, yearSelected])


  const historyData = useMemo(() => {
    return listOfMonths.map((_, month) => {

      let amountEntry = 0
      gains.forEach(gain => {
        const date = new Date(gain.date)
        const gainMonth = date.getMonth()
        const gainYear = date.getFullYear()

        if (gainMonth === month && gainYear === yearSelected) {
          try {
            amountEntry += Number(gain.amount)
          }
          catch {
            throw new Error('amountEntry is invalid! It\'s most be valid number')
          }
        }
      })

      let amountOutPut = 0
      expenses.forEach(expense => {
        const date = new Date(expense.date)
        const gainMonth = date.getMonth()
        const gainYear = date.getFullYear()

        if (gainMonth === month && gainYear === yearSelected) {
          try {
            amountOutPut += Number(expense.amount)
          }
          catch {
            throw new Error('amountOutPut is invalid! It\'s most be valid number')
          }
        }
      })

      return {
        monthNumber: month,
        month: listOfMonths[month].substr(0, 3),
        amountEntry,
        amountOutPut
      }
    })
      .filter(item => {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        return ((yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear))
      })
  }, [yearSelected])


  const handleMonthSelected = useCallback((month: string) => {
    try {
      const parseMonth = Number(month)
      setMonthSelected(parseMonth)
    }
    catch {
      throw new Error('Invalid month value. Is accepted 0 - 12.')
    }
  }, [])


  const handleYearSelected = useCallback((year: string) => {
    try {
      const parseYear = Number(year)
      setYearSelected(parseYear)
    }
    catch {
      throw new Error('Invalid year value. Is accepted integer numbers.')
    }
  }, [])

  return (
    <Container>
      <ContentHeader title='Dashboard' lineColor='#F7931B'>
        <SelectInput
          options={months}
          onChange={e => handleMonthSelected(e.target.value)}
          defaultValue={monthSelected}
        />
        <SelectInput
          options={years}
          onChange={e => handleYearSelected(e.target.value)}
          defaultValue={yearSelected}
        />
      </ContentHeader>
      <Content>
        <WalletBox
          title='saldo'
          amount={totalBallance}
          footerLabel='atualizado com base nas entradas e saídas'
          icon='dollar'
          color={'#4E41F0'}
        />


        <WalletBox
          title='entradas'
          amount={totalGains}
          footerLabel='atualizado com base nas entradas e saídas'
          icon='arrowUp'
          color={'#F7931B'}
        />


        <WalletBox
          title='saídas'
          amount={totalExpenses}
          footerLabel='atualizado com base nas entradas e saídas'
          icon='arrowDown'
          color={'#E44C4E'}
        />

        <MessageBox
          title={message.title}
          description={message.description}
          footerText={message.footerText}
          icon={message.icon}
        />

        <PieChartBox data={relationOfBallance} />

        <HistoryBox
          data={historyData}
          lineColorAmountEntry='#F7931B'
          lineColorAmountOutPut='#F44C4E'
        />

        <BarChartBox
          title='Saídas'
          data={relationOfExpenses}
        />
        <BarChartBox
          title='Entradas'
          data={relationOfGains}
        />

      </Content>
    </Container>
  )
}


export default Dashboard