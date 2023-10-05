import axiosInstance from "./axiosInstance"
import { useState } from 'react'

const getFetcher = (url: string) => {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    axiosInstance.get(url).then((res) => {
        setData(res.data)
        setLoading(false)
    }).catch((err) => {
        setError(err)
        setLoading(false)
    })
    return { data, error, isLoading }
}

const postFetcher = (url: string, datas: any) => {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    axiosInstance.post(url, datas).then((res) => {
        setData(res.data)
        setLoading(false)
    }).catch((err) => {
        setError(err)
        setLoading(false)
    })
    return { data, error, isLoading }
};

export { getFetcher, postFetcher }