module Main exposing (main)

import Browser exposing (Document)
import Html exposing (Html, button, div, h1, p, text)
import Html.Events exposing (onClick)
import Http
import Intl exposing (Intl)
import Random
import Time
import Translations exposing (I18n, Language)


type Msg
    = GotTranslations (Result Http.Error (I18n -> I18n))
    | ChangeLanguage Language
    | TimeToRoll
    | GotNextRandom (List Int)


type alias Model =
    { i18n : I18n
    , diceRolls : List Int
    }


init : Flags -> ( Model, Cmd Msg )
init { intl, language } =
    let
        lang =
            Translations.languageFromString language |> Maybe.withDefault Translations.En

        i18n =
            Translations.init { intl = intl, lang = lang, path = "/translations" }
    in
    ( { i18n = i18n, diceRolls = [] }
    , Cmd.batch
        [ Translations.loadMessages GotTranslations i18n
        , Random.generate GotNextRandom <| rollN 6
        ]
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotTranslations (Ok addTranslations) ->
            ( { model | i18n = addTranslations model.i18n }, Cmd.none )

        GotTranslations (Err _) ->
            ( model, Cmd.none )

        TimeToRoll ->
            ( model, Random.generate GotNextRandom <| rollN 6 )

        GotNextRandom diceRolls ->
            ( { model | diceRolls = diceRolls }, Cmd.none )

        ChangeLanguage language ->
            let
                ( i18n, cmds ) =
                    Translations.switchLanguage language GotTranslations model.i18n
            in
            ( { model | i18n = i18n }, cmds )


roll : Random.Generator Int
roll =
    Random.int 1 6


rollN : Int -> Random.Generator (List Int)
rollN n =
    Random.list n roll


view : Model -> Document Msg
view ({ i18n } as model) =
    let
        currentLangString =
            Translations.languageToString <| Translations.currentLanguage model.i18n

        numberOfSixes =
            model.diceRolls |> List.filter ((==) 6) |> List.length
    in
    { title = "Example: " ++ currentLangString
    , body =
        [ h1 [] [ text <| Translations.title i18n ]
        , div [] <| List.map (changeLanguageButton i18n) Translations.languages
        , p [] [ text <| Translations.paragraph i18n ]
        , p [] [ text <| Translations.demo (toFloat numberOfSixes) i18n ]
        ]
    }


changeLanguageButton : I18n -> Language -> Html Msg
changeLanguageButton i18n language =
    button [ onClick <| ChangeLanguage language ] [ text <| Translations.language (Translations.languageToString language) i18n ]


subscriptions : Model -> Sub Msg
subscriptions _ =
    Time.every 2000 (always TimeToRoll)


type alias Flags =
    { language : String
    , intl : Intl
    }


main : Program Flags Model Msg
main =
    Browser.document
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
