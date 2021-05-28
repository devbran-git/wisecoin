import React, { useMemo, useState, useEffect } from 'react'

import { v4 as uuid_v4 } from "uuid"

import ContentHeader from '../../components/ContentHeader'
import SelectInput from '../../components/SelectInput'
import HistoryFinanceCard from '../../components/HistoryFinanceCard'

import gains from '../../repositories/gains'
import expenses from '../../repositories/expenses'
import { formatCurrency, formatDate } from '../../utils/dataFormatter'
import listOfMonths from '../../utils/months'

import {
  Container,
  Content,
  Filters
} from './styles'

interface IRouteParams {
  match: {
    params: {
      type: string
    }
  }
}

interface IData {
  id: string
  description: string
  amountFormated: string
  frequency: string
  dateFormatted: string
  tagColor: string
}

const Lists: React.FC<IRouteParams> = ({ match }) => {

  const [data, setData] = useState<IData[]>([])
  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1)
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear())
  const [filterFrequencySelected, setilterFrequencySelected] = useState(['recorrente', 'eventual'])

  const { type } = match.params

  const sendType = useMemo(() => {
    return type === 'entry-balance' ? {
      title: 'Entradas',
      lineColor: '#4E41F0'
    } : {
      title: 'Saídas',
      lineColor: '#E44C4E'
    }
  }, [type])

  const listData = useMemo(() => {
    return type === 'entry-balance' ? gains : expenses
  }, [type])


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

    listData.forEach(item => {
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

  }, [listData])


  const handleFrequencyClick = (frequency: string) => {
    const alreadySelected = filterFrequencySelected.findIndex(item => item === frequency)
    if (alreadySelected >= 0) {
      const filtered = filterFrequencySelected.filter(item => item !== frequency)
      setilterFrequencySelected(filtered)
    } else {
      setilterFrequencySelected(prev => [...prev, frequency])
    }

  }


  const handleMonthSelected = (month: string) => {
    try {
      const parseMonth = Number(month)
      setMonthSelected(parseMonth)
    }
    catch {
      throw new Error('Invalid month value. Is accepted 0 - 12.')
    }
  }


  const handleYearSelected = (year: string) => {
    try {
      const parseYear = Number(year)
      setYearSelected(parseYear)
    }
    catch {
      throw new Error('Invalid year value. Is accepted integer numbers.')
    }
  }


  useEffect(() => {

    const filteredDate = listData.filter(item => {
      const date = new Date(item.date)
      const month = date.getMonth() + 1
      const year = date.getFullYear()

      return month === monthSelected && year === yearSelected && filterFrequencySelected.includes(item.frequency)
    })

    const formattedDate = filteredDate.map(item => {
      return {
        id: uuid_v4(),
        description: item.description,
        amountFormated: formatCurrency(Number(item.amount)),
        frequency: item.frequency,
        dateFormatted: formatDate(item.date),
        tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E'
      }
    })

    setData(formattedDate)
  }, [listData, monthSelected, yearSelected, filterFrequencySelected])


  return (
    <Container>
      <ContentHeader title={sendType.title} lineColor={sendType.lineColor}>
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

      <Filters>
        <button
          type='button'
          className={`
          tag-filter 
          tag-filter-recurrent
          ${filterFrequencySelected.includes('recorrente') && 'tag-actived'}`}
          onClick={() => handleFrequencyClick('recorrente')}
        >
          Recorrentes
        </button>
        <button
          type='button'
          className={`
          tag-filter 
          tag-filter-eventual
          ${filterFrequencySelected.includes('eventual') && 'tag-actived'}`}
          onClick={() => handleFrequencyClick('eventual')}
        >
          Eventuais
        </button>
      </Filters>

      <Content>
        {
          data.map(item => (
            <HistoryFinanceCard
              key={item.id}
              tagColor={item.tagColor}
              title={item.description}
              subtitle={item.dateFormatted}
              amount={item.amountFormated}
            />
          ))
        }
      </Content>
    </Container>
  )
}

export default Lists