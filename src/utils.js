// This render only existing variables, keeping everything else
// eg .github ${{ secrets }} won't be replaced if the value is not provided
export const render = (
    data,
    variables,
    delimiterStart = '{{',
    delimiterEnd = '}}'
) =>
    Object.entries(variables).reduce((rendered, [varname, varvalue]) => {
        const result = rendered.replace(
            new RegExp(
                `${delimiterStart} {0,}?${varname} {0,}?${delimiterEnd}`,
                'g'
            ),
            varvalue
        );
        return result;
    }, data.toString());
