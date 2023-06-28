import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
render(<IletisimFormu />);

});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />);

expect(screen.getByRole('heading'));
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
const nameInput = screen.getByPlaceholderText("İlhan");
userEvent.type(nameInput, "abc");


expect(screen.getByText("Hata: ad en az 5 karakter olmalıdır."));

});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const err = await screen.findAllByTestId("error");
    expect(err).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);
    const nameInput = screen.getByPlaceholderText("İlhan");
    const surnameInput = screen.getByPlaceholderText("Mansız");
    const button = screen.getByRole("button");

    userEvent.type(nameInput, "abcde");
    userEvent.type(surnameInput, "abcde");
    fireEvent.click(button);

    const err = await screen.findAllByTestId("error");
    expect(err).toHaveLength(1);

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const emailInput = screen.getByLabelText("Email*");
    userEvent.type(emailInput, "abc@abc");
    
    expect(screen.getByText(/email geçerli bir email adresi olmalıdır./i));
    
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const surnameInput = screen.getByPlaceholderText("Mansız");
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText(/soyad gereklidir./i));
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />);
    const nameInput = screen.getByPlaceholderText("İlhan");
    const surnameInput = screen.getByPlaceholderText("Mansız");
    const emailInput = screen.getByLabelText("Email*");

    userEvent.type(nameInput , "abc1@abc.com");
    userEvent.type(surnameInput , "abc2@abc.com");
    userEvent.type(emailInput , "abc3@abc.com");

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const message = screen.queryByTestId("messageDisplay");
    expect(message).not.toBeInTheDocument();

});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);
    const nameInput = screen.getByPlaceholderText("İlhan");
    const surnameInput = screen.getByPlaceholderText("Mansız");
    const emailInput = screen.getByLabelText("Email*");
    const messInput = screen.getByLabelText("Mesaj");

    userEvent.type(nameInput , "abc1@abc.com");
    userEvent.type(surnameInput , "abc2@abc.com");
    userEvent.type(emailInput , "abc3@abc.com");
    userEvent.type(messInput , "abc4@abc.com");

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText(/abc1@abc.com/i)).toBeInTheDocument();
    expect(screen.getByText(/abc2@abc.com/i)).toBeInTheDocument();
    expect(screen.getByText(/abc3@abc.com/i)).toBeInTheDocument();
    expect(screen.getByText(/abc4@abc.com/i)).toBeInTheDocument();
});
