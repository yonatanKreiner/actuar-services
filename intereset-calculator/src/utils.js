const dateToString = date => {
    return date.toISOString().split('T')[0];
}

export {dateToString}