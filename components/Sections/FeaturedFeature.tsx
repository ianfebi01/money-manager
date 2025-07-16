'use client'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef } from 'react'
import BouncingText from '../BounchingText'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin( ScrollTrigger )

const FeaturedFeature = () => {
  const itemsRef = useRef<HTMLDivElement[] | null[]>( [] )
  const containerRef = useRef<HTMLDivElement | null>( null )

  useEffect( () => {
    const ctx = gsap.context( () => {
      gsap.to( itemsRef.current, {
        y             : 0,
        opacity       : 1,
        ease          : 'power2.out',
        stagger       : 0.2,
        duration      : 0.75,
        delay         : 0.2,
        scrollTrigger : {
          trigger       : containerRef.current,
          start         : 'top 80%',
          toggleActions : 'restart none none none',
        },
      } )
    } )

    return () => ctx.revert()
  }, [] )

  return (
    <div ref={containerRef}>
      <h2 className="m-0 text-center leading-[38px] md:text-4xl md:leading-[55px] max-w-xs md:max-w-sm mx-auto flex flex-col">
        <span>temukan</span>
        <span>
          <span className="text-orange py-2 px-4 bg-orange/10 rounded-full w-fit overflow-hidden">
            <FontAwesomeIcon icon={faPuzzlePiece}
              className="mr-4"
            />
            <BouncingText text="fitur" />
          </span>{' '}
          menarik dari money manager
        </span>
      </h2>
      <div className="flex flex-col md:flex-row gap-8 mt-12">
        <div
          ref={( el ) => ( itemsRef.current[0] = el )}
          className="bg-dark-secondary flex flex-col rounded-lg border border-dark-secondary overflow-hidden opacity-0 translate-y-[50px]"
        >
          <div className="p-4">
            <h2>Grafik Transaksi Interaktif</h2>
            <p className="text-white/80">
              Pantau alur keuanganmu setiap bulan lewat grafik batang dan donat
              yang intuitif. Lihat perbandingan pemasukan vs pengeluaran, serta
              distribusi pengeluaran per kategori—semua dalam satu tampilan yang
              jelas dan modern.
            </p>
          </div>
          <div className="relative h-64 w-full ml-4">
            <Image
              src="/images/transaction-summary.png"
              alt="Transaction Summary"
              fill
              className="object-cover object-left-top rounded-tl-lg"
            />
          </div>
        </div>
        <div ref={( el ) => ( itemsRef.current[1] = el )}
          className="bg-dark-secondary flex flex-col rounded-lg border border-dark-secondary overflow-hidden opacity-0 translate-y-[50px]"
        >
          <div className="p-4">
            <h2>Grafik Transaksi Interaktif</h2>
            <p className="text-white/80">
              Pantau alur keuanganmu setiap bulan lewat grafik batang dan donat
              yang intuitif. Lihat perbandingan pemasukan vs pengeluaran, serta
              distribusi pengeluaran per kategori—semua dalam satu tampilan yang
              jelas dan modern.
            </p>
          </div>
          <div className="relative h-64 w-full mr-4 -translate-x-4">
            <Image
              src="/images/add-transaction.png"
              alt="Add Transaction"
              fill
              className="object-cover object-right-bottom rounded-tr-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedFeature
