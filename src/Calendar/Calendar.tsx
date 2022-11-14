import React, {useEffect, useState} from 'react'
import moment from "moment";

export interface minMaxDate {
    firstPick: moment.Moment | string | undefined,
    secondPick: moment.Moment | string | undefined
}
export interface clickedDay {
    day: moment.Moment | string | undefined,
    index: string | undefined
}
const Calendar = () => {
    const [calendar, setCalendar] = useState<any>([]);
    const [isClicked, setisClicked] = useState<string | any>('')
    const [lastClicked, setLastClicked] = useState<clickedDay>()
    const [currentMonth, setCurrentMonth] = useState<number>(0)
    const [currentYear, setCurrentYear] = useState<number>(0)
    const [selectedDate, setSelectedDate] = useState<string>('')
    const [selectOneDate, setSelectOneDate] = useState<boolean>(true)
    const [rangeDate, setRangeDate] = useState<boolean>()
    const [arrayOfCalendar, setArrayOfCalendar] = useState<any>([]);
    const [selectMultipleDate, setSelectMultipleDate] = useState<minMaxDate>()
    const [firstClick, setFirstClick] = useState<boolean>(true)
    const getAllDays = (today: moment.Moment) => {
        const cal: any = [];
        const startDay = today.clone().startOf('month').startOf('week');
        const endDay = today.clone().endOf('month').endOf('week');
        const date = startDay.clone().subtract(1, 'day');
        while (date.isBefore(endDay, 'day'))
            cal.push({
                days: Array(7)
                    .fill(0)
                    .map(() => date.add(1, 'day').clone()),
            });
        setCalendar(cal);
    }
    useEffect(() => {
        getAllDays(moment().add(currentMonth, 'month'))
        setCurrentMonth(moment(new Date()).add(1, "month").month())
        setCurrentYear(new Date().getFullYear())
    }, []);
    const getDateRange = (el: string, index: string) => {
        if (firstClick) {
            setisClicked(index)
            setSelectMultipleDate({
                firstPick: el,
                secondPick: ''
            })
            setFirstClick(false)
        } else {
            if (moment(el).isBefore(moment(selectMultipleDate && selectMultipleDate.firstPick))) {
                setSelectMultipleDate({
                    firstPick: el,
                    secondPick: selectMultipleDate && selectMultipleDate.firstPick
                })
            } else {
                setSelectMultipleDate({
                    firstPick: selectMultipleDate?.firstPick,
                    ...selectMultipleDate,
                    secondPick: el
                })
            }
        }
    }
    const getDate = (el: moment.Moment, index: string) => {
        if (selectOneDate) {
            setisClicked(index)
            setSelectedDate(el.format('DD/MM/YYYY'))
        } else {
            setisClicked(index)
            setSelectedDate(el.format('DD/MM/YYYY'))
        }
    }
    const array: any = []
    useEffect(() => {
        Object.keys(calendar).map((item: string) => {
            calendar[item].days.map((el: string) => {
                array.push(el)
            })
            setArrayOfCalendar(array)
        })
    }, [calendar])
    useEffect(() => {
        Object.keys(arrayOfCalendar).map((item: string) => {
            if (arrayOfCalendar[item].format('DD/MM/YYYY') === lastClicked && lastClicked?.day) {
                setisClicked(lastClicked?.index)
            }
        })
    }, [arrayOfCalendar])
    const dateNow = new Date();
    const goToPreviousMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12)
            setCurrentYear(currentYear - 1)
            if (isClicked) {
                setLastClicked({
                    day: selectedDate,
                    index: isClicked
                })
            }
            setisClicked('')
        } else {
            setCurrentMonth(currentMonth - 1)
            if (isClicked) {
                setLastClicked({
                    day: selectedDate,
                    index: isClicked
                })
            }
            setisClicked('')
        }
        getAllDays(moment(new Date(currentYear, currentMonth - 2)))
    }
    const goToNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1)
            setCurrentYear(currentYear + 1)
            if (isClicked) {
                setLastClicked({
                    day: selectedDate,
                    index: isClicked
                })
            }
            setisClicked('')
        } else {
            setCurrentMonth(currentMonth + 1)
            if (isClicked) {
                setLastClicked({
                    day: selectedDate,
                    index: isClicked
                })
            }
            setisClicked('')
        }
        getAllDays(moment(new Date(currentYear, currentMonth)))
    }
    return (
        <div className={'calendarContain'}>
            <div>
                <div className={'previousNextContain'} style={{
                    alignItems: 'center',
                    margin: '15px',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    padding: '20px'
                }}>
                    <div className={'nexMonthDiv'}>
                        <span onClick={goToPreviousMonth}
                              className={'goToStyle'}>
                      {
                          '<<'
                      }
                  </span>
                    </div>
                    <span className={'spanTitle'}>
                        {
                            moment(new Date(currentYear, currentMonth - 1)).format('MMMM/YYYY')
                        }
                 </span>
                    <div className={'nexMonthDiv'}>
                        <span className={'goToStyle'} onClick={goToNextMonth}>
                   {
                       '>>'
                   }
                  </span>
                    </div>
                </div>
                <div className={'title'}>
                    {
                        Object.keys(arrayOfCalendar.slice(0, 7)).map((el: string, index: number) => (
                            <span className={'spanTitle'} key={index.toString()}>
                             {
                                 arrayOfCalendar[el].format('dd')
                             }
                         </span>

                        ))
                    }
                </div>
                {
                    selectOneDate &&
                    <div className={'calendar'}>
                        {
                            Object.keys(arrayOfCalendar).map((el: string, index: number) => (
                                <button disabled={moment(arrayOfCalendar[el]).isBefore(moment(dateNow))} key={index}
                                        onClick={() => getDate(arrayOfCalendar[el], index.toString())}
                                        className={`calendarDays  ${isClicked.toString() === index.toString()}`}> {arrayOfCalendar[el].format('DD')}</button>
                            ))
                        }
                    </div>
                }
                {
                    rangeDate &&
                    <div className={'calendar'}>
                        {
                            Object.keys(arrayOfCalendar).map((el: string, index: number) => (
                                <button disabled={moment(arrayOfCalendar[el]).isBefore(moment(dateNow))} key={index}
                                        onClick={() => getDateRange(arrayOfCalendar[el], index.toString())}
                                        className={`calendarDays  ${isClicked.toString() === index.toString() || moment(arrayOfCalendar[el]).isBetween(moment(selectMultipleDate?.firstPick), moment(selectMultipleDate?.secondPick), null, '[]')}`}> {arrayOfCalendar[el].format('DD')}</button>
                            ))
                        }
                    </div>
                }
            </div>
            <div style={{display: 'flex', justifyContent: 'space-evenly',alignItems:'center'}}>
                {
                    selectOneDate &&
                    <span className={'selectedDate'}>
                {'SELECTED DATE IS:' + ' ' + selectedDate}
            </span>
                }
                <button className={'btn-type'} style={{backgroundColor: selectOneDate ? 'gray' : 'white'}}
                        onClick={() => {
                            setSelectOneDate(true)
                            setRangeDate(false)
                        }}>
                    select one date
                </button>
                <button className={'btn-type'} style={{backgroundColor: rangeDate ? 'gray' : 'white'}} onClick={() => {
                    setRangeDate(true);
                    setSelectOneDate(false)
                }}>
                    select Multiple of dates
                </button>
            </div>
        </div>
    )
}
export default Calendar